import type { Resource } from '../types.js';
import { filterReachable } from '../utils/reachable.js';
import { stripTags } from '../utils/text.js';
import { fetchTimed } from '../utils/fetch.js';

type Item = {
  uid: string;
  title: string;
  summary?: string;
  url: string;
  levels?: string[];
  products?: string[];
  roles?: string[];
  subjects?: string[];
  duration_in_minutes?: number;
  modules?: unknown[];
};

const LEVELS = new Set(['beginner', 'intermediate', 'advanced']);

export async function fetchMslearn(config: Record<string, unknown>): Promise<Resource[]> {
  const types = Array.isArray(config.types) ? (config.types as string[]) : ['learningPaths'];
  const r = await fetchTimed('https://learn.microsoft.com/api/catalog/?locale=en-us', {
    headers: { 'User-Agent': 'techatlas-collector' },
  });
  if (!r.ok) throw new Error(`mslearn catalog ${r.status}`);
  const data = (await r.json()) as Record<string, Item[]>;

  const items = types.flatMap((t) => data[t] ?? []);
  const resources = items.map((item) => ({
    title: item.title,
    description: stripTags(item.summary ?? '').slice(0, 600) || null,
    url: item.url.replace(/\?.*$/, ''),
    source_type: 'course',
    source_name: 'Microsoft Learn',
    tags: [...new Set(['mslearn', ...(item.products ?? []), ...(item.roles ?? [])])].slice(0, 6),
    category: 'course',
    difficulty: (item.levels ?? []).find((l) => LEVELS.has(l)) ?? null,
    metadata: {
      duration_minutes: item.duration_in_minutes,
      modules: item.modules?.length ?? null,
      last_modified: (item as { last_modified?: string }).last_modified,
    },
  }));

  const reachable = await filterReachable(resources, (x) => x.url);
  console.log(`Microsoft Learn: ${reachable.length}/${resources.length} reachable`);
  return reachable;
}
