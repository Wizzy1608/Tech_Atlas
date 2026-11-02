import type { Resource } from '../types.js';
import { filterReachable } from '../utils/reachable.js';

type CuratedItem = {
  title: string;
  url: string;
  description?: string;
  source_name?: string;
  tags?: string[];
  category?: string;
  difficulty?: string;
};

// Hand-picked flagship courses/curricula — no scraping, no niche blogs.
export async function fetchCurated(config: Record<string, unknown>): Promise<Resource[]> {
  const items = Array.isArray(config.items) ? (config.items as CuratedItem[]) : [];
  const resources: Resource[] = items.map((i) => ({
    title: i.title,
    description: i.description ?? null,
    url: i.url,
    source_type: i.category ?? 'course',
    source_name: i.source_name ?? 'Curated',
    tags: i.tags ?? [],
    category: i.category ?? 'course',
    difficulty: i.difficulty ?? null,
    metadata: { curated: true },
  }));

  const reachable = await filterReachable(resources, (r) => r.url);
  console.log(`Curated: ${reachable.length}/${resources.length} reachable`);
  return reachable;
}
