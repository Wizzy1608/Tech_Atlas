import type { Pool } from 'pg';
import { fetchCurated } from './fetchers/curated.js';
import { fetchFmhy } from './fetchers/fmhy.js';
import { fetchFreecodecamp } from './fetchers/freecodecamp.js';
import { fetchGithubRepos } from './fetchers/github-repos.js';
import { fetchMslearn } from './fetchers/mslearn.js';
import { fetchOpenstax } from './fetchers/openstax.js';
import { fetchOpenTextbookLibrary } from './fetchers/otl.js';
import { fetchYoutube } from './fetchers/youtube.js';
import { storeResource } from './utils/store.js';
import type { Fetcher } from './types.js';

const FETCHERS: Record<string, Fetcher> = {
  'github-repos': fetchGithubRepos,
  youtube: fetchYoutube,
  openstax: fetchOpenstax,
  'open-textbook-library': fetchOpenTextbookLibrary,
  'freecodecamp-rss': fetchFreecodecamp,
  mslearn: fetchMslearn,
  curated: fetchCurated,
  fmhy: fetchFmhy,
};

export async function runCollector(db: Pool, log = console.log) {
  const { rows: configs } = await db.query(
    `SELECT * FROM source_configs WHERE is_active = TRUE`,
  );

  for (const cfg of configs) {
    const fetcher = FETCHERS[cfg.source_type];
    if (!fetcher) {
      log(`skip ${cfg.name}: no fetcher for "${cfg.source_type}"`);
      continue;
    }
    try {
      const items = await fetcher(cfg.config);
      const client = await db.connect();
      try {
        await client.query('BEGIN');
        for (const item of items) await storeResource(client, item);
        await client.query(`UPDATE source_configs SET last_fetched_at = now() WHERE id = $1`, [cfg.id]);
        await client.query('COMMIT');
        log(`${cfg.name}: ${items.length} resources`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      log(`${cfg.name} FAILED: ${(err as Error).message}`);
    }
  }
}
