import type { NextFunction, Request, Response } from 'express';
import type { PluginContext } from '../../plugin-registry.js';

// Columns the SPA actually reads — never ship search_vector or helper counts.
const COLS = `r.id, r.title, r.description, r.url, r.source_type, r.source_name, r.tags,
  r.category, r.difficulty, r.domain, r.domain_icon, r.metadata, r.collected_at`;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function filterSql(column: string, value: string | undefined, params: unknown[]) {
  if (!value) return '';
  const negate = value.startsWith('!');
  params.push(negate ? value.slice(1) : value);
  // NULL rows are not that value either — plain <> would silently drop them.
  return ` AND ${column} ${negate ? 'IS DISTINCT FROM' : '='} $${params.length}`;
}

function resourceWhere(query: Record<string, string | undefined>, params: unknown[]) {
  let sql = '';
  sql += filterSql('r.category', query.category, params);
  sql += filterSql('r.domain', query.domain, params);
  sql += filterSql('r.difficulty', query.difficulty, params);
  sql += filterSql('r.source_type', query.source_type, params);
  sql += filterSql('r.source_name', query.source_name, params);
  return sql;
}

export function register({ app, db }: PluginContext) {
  app.get('/api/resources', async (req: Request, res: Response) => {
    const params: unknown[] = [];
    const where = resourceWhere(req.query as Record<string, string | undefined>, params);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const { rows } = await db.query(
      `SELECT ${COLS}, count(*) OVER() AS total_count FROM resources r WHERE TRUE${where} ORDER BY r.collected_at DESC LIMIT ${limit} OFFSET ${offset}`,
      params,
    );
    res.setHeader('X-Total-Count', String(rows[0]?.total_count ?? 0));
    res.json(rows.map(({ total_count: _total, ...r }) => r));
  });

  app.get('/api/recent', async (_req: Request, res: Response) => {
    const { rows } = await db.query(
      `SELECT ${COLS} FROM resources r WHERE r.collected_at > now() - interval '7 days' ORDER BY r.collected_at DESC LIMIT 20`,
    );
    res.json(rows);
  });

  app.get('/api/search', async (req: Request, res: Response) => {
    const q = String(req.query.q ?? '').trim();
    if (!q) {
      res.json({ results: [], related: [], total: 0 });
      return;
    }
    const params: unknown[] = [q];
    let diffSql = '';
    if (req.query.diff) {
      params.push(String(req.query.diff));
      diffSql = ` AND r.difficulty = $2`;
    }
    // count(*) OVER() runs before LIMIT, so it is the real match count, not 20.
    const { rows } = await db.query(
      `WITH matched AS (
         SELECT ${COLS}, count(*) OVER() AS total_count
         FROM resources r, websearch_to_tsquery('english', $1) query
         WHERE (
           r.search_vector @@ query
           OR similarity(r.title, $1) > 0.15
           OR EXISTS (
             SELECT 1 FROM unnest(string_to_array(r.title, ' ')) w
             WHERE similarity(w, $1) > 0.4
           )
         )${diffSql}
         ORDER BY ts_rank(r.search_vector, query) DESC, r.collected_at DESC
         LIMIT 20
       )
       SELECT * FROM matched`,
      params,
    );
    const total = rows[0]?.total_count ?? 0;
    const results = rows.map(({ total_count: _total, ...r }) => r);

    let related: Record<string, unknown>[] = [];
    if (results.length > 0) {
      const ids = results.map((r) => r.id);
      const { rows: rel } = await db.query(
        `WITH mtags AS (
           SELECT array_agg(DISTINCT tg) AS tags FROM resources m, unnest(m.tags) tg
           WHERE m.id = ANY($1::uuid[])
         )
         SELECT ${COLS}
         FROM resources r, mtags
         WHERE r.id <> ALL($1::uuid[])
           AND (SELECT count(*) FROM unnest(r.tags) t WHERE t = ANY(mtags.tags)) >= 2
         ORDER BY r.collected_at DESC
         LIMIT 10`,
        [ids],
      );
      related = rel;
    }

    res.json({ results, related, total });
  });

  app.get('/api/resources/:id', async (req: Request, res: Response) => {
    const id = String(req.params.id);
    if (!UUID.test(id)) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    const { rows } = await db.query(`SELECT ${COLS} FROM resources r WHERE r.id = $1`, [id]);
    if (!rows[0]) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    res.json(rows[0]);
  });

  app.use('/api', (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.message);
    res.status(500).json({ error: 'internal error' });
  });
}
