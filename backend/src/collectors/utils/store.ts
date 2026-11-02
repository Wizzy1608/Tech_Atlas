import type { Pool, PoolClient } from 'pg';
import { classify, DOMAIN_ICONS } from '../../classifier.js';
import type { Resource } from '../types.js';

export async function storeResource(db: Pool | PoolClient, r: Resource): Promise<void> {
  const c = classify(r);
  await db.query(
    `INSERT INTO resources (title, description, url, source_type, source_name, tags, category, difficulty, domain, domain_icon, classification_method, classification_score, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (url) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        source_name = EXCLUDED.source_name,
        tags = EXCLUDED.tags,
        source_type = EXCLUDED.source_type,
        category = EXCLUDED.category,
        difficulty = EXCLUDED.difficulty,
        metadata = EXCLUDED.metadata,
        domain = EXCLUDED.domain,
        domain_icon = EXCLUDED.domain_icon,
        classification_method = EXCLUDED.classification_method,
        classification_score = EXCLUDED.classification_score,
        collected_at = now()
      WHERE NOT (resources.metadata->>'curated' = 'true' AND EXCLUDED.metadata->>'curated' IS DISTINCT FROM 'true')`,
    [
      r.title,
      r.description,
      r.url,
      r.source_type,
      r.source_name,
      [...new Set(r.tags)],
      r.category,
      r.difficulty,
      c.domain,
      c.domain ? DOMAIN_ICONS[c.domain] : null,
      c.method,
      c.score,
      r.metadata,
    ],
  );
}
