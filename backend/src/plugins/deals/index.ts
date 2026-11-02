import type { Request, Response } from 'express';
import type { PluginContext } from '../../plugin-registry.js';

export function register({ app, db }: PluginContext) {
  app.get('/api/deals', async (_req: Request, res: Response) => {
    const { rows } = await db.query(
      `SELECT * FROM deals
       WHERE is_active = TRUE AND (valid_until IS NULL OR valid_until > now())
       ORDER BY discount_percent DESC NULLS LAST, collected_at DESC
       LIMIT 10`,
    );
    res.json(rows);
  });
}
