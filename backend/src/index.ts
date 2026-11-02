import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, migrate } from './db.js';
import { loadPlugins } from './plugin-registry.js';

const here = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL missing — copy .env.example to .env');
  process.exit(1);
}

const app = express();
// ponytail: CSP off while the SPA is served from the same origin; tighten with
// asset hashes when deploying behind a public URL.
app.use(helmet({ contentSecurityPolicy: false }));
// Only trust X-Forwarded-For when a proxy actually sets it (TRUST_PROXY=1),
// otherwise clients can spoof it to dodge the limiter.
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY));
app.use('/api', rateLimit({ windowMs: 60_000, max: 100 }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const loaded = await loadPlugins(app, pool);
app.get('/api/plugins', (_req, res) => {
  res.json({ plugins: loaded });
});

app.get('/api/meta', async (_req, res) => {
  const [cats, doms] = await Promise.all([
    pool.query(`SELECT DISTINCT category FROM resources WHERE category IS NOT NULL ORDER BY category`),
    pool.query(`SELECT DISTINCT domain, domain_icon FROM resources WHERE domain IS NOT NULL ORDER BY domain`),
  ]);
  res.json({
    categories: cats.rows.map((r) => r.category),
    domains: doms.rows,
  });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'not found' });
});

const dist = path.join(here, '..', '..', 'frontend', 'dist');
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.use((_req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).send('frontend not built — run `npm run dev` in frontend/');
  });
}

const port = Number(process.env.PORT ?? 3001);
await migrate();
app.listen(port, () => console.log(`TechAtlas api on http://localhost:${port} (${loaded.join(', ') || 'no plugins'})`));
