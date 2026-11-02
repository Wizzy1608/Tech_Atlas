import { pool } from './db.js';
import { runCollector } from './collectors/index.js';

await runCollector(pool);
await pool.end();
