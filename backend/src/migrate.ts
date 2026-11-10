import { pool, migrate } from './db.js';

await migrate();
await pool.end();
