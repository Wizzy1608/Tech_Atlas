import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Express } from 'express';
import type { Pool } from 'pg';

export type PluginContext = { app: Express; db: Pool; name: string };

export async function loadPlugins(app: Express, db: Pool): Promise<string[]> {
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'plugins');
  const loaded: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    try {
      const mod = (await import(`./plugins/${entry.name}/index.js`)) as {
        register?: (ctx: PluginContext) => void | Promise<void>;
      };
      if (typeof mod.register === 'function') {
        await mod.register({ app, db, name: entry.name });
        loaded.push(entry.name);
        console.log(`plugin loaded: ${entry.name}`);
      }
    } catch (err) {
      console.error(`plugin "${entry.name}" failed:`, (err as Error).message);
    }
  }
  return loaded;
}
