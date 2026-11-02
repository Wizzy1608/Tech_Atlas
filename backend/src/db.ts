import { Pool } from 'pg';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env before Pool construction — import hoisting means this module
// evaluates before the importing entry module's body.
const envFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ponytail: migrate-on-boot assumes a single app instance; if you scale to
// multiple replicas, move this to a Fly release_command instead.
export async function migrate() {
  await pool.query(`CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY)`);
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
  const done = new Set((await pool.query('SELECT name FROM _migrations')).rows.map((r) => r.name));
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
    if (done.has(f)) continue;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(readFileSync(path.join(dir, f), 'utf8'));
      await client.query('INSERT INTO _migrations (name) VALUES ($1)', [f]);
      await client.query('COMMIT');
      console.log(`migration applied: ${f}`);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
