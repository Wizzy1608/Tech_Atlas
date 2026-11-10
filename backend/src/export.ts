import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

// Build-time export: the deployed site never talks to Postgres. One resource
// per line so a data refresh produces a readable git diff.
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', '..', 'frontend', 'public', 'catalogue.json');

const COLS = `id, title, description, url, source_type, source_name, tags,
  category, difficulty, domain, domain_icon, metadata, collected_at`;

const { rows } = await pool.query(`SELECT ${COLS} FROM resources ORDER BY collected_at DESC`);
const [cats, doms] = await Promise.all([
  pool.query(`SELECT DISTINCT category FROM resources WHERE category IS NOT NULL ORDER BY category`),
  pool.query(`SELECT DISTINCT domain, domain_icon FROM resources WHERE domain IS NOT NULL ORDER BY domain`),
]);

const json = [
  '{',
  `"generated_at":${JSON.stringify(new Date().toISOString())},`,
  `"categories":${JSON.stringify(cats.rows.map((r) => r.category))},`,
  `"domains":${JSON.stringify(doms.rows)},`,
  '"resources":[',
  rows.map((r) => JSON.stringify(r)).join(',\n'),
  ']',
  '}',
].join('\n');

mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, json);
console.log(`exported ${rows.length} resources (${(Buffer.byteLength(json) / 1024).toFixed(0)} KB) -> ${out}`);
await pool.end();
