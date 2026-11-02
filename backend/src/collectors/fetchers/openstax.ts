import type { Resource } from '../types.js';
import { filterReachable } from '../utils/reachable.js';
import { fetchTimed } from '../utils/fetch.js';

type Book = {
  title: string;
  book_state: string;
  meta: { slug: string; html_url: string; first_published_at?: string };
};

export async function fetchOpenstax(config: Record<string, unknown>): Promise<Resource[]> {
  const limit = Number(config.limit ?? 150);
  const r = await fetchTimed(
    `https://openstax.org/apps/cms/api/v2/pages/?type=books.Book&fields=title,slug,book_state&limit=${limit}`,
    { headers: { 'User-Agent': 'techatlas-collector' } },
  );
  if (!r.ok) throw new Error(`openstax ${r.status}`);
  const data = (await r.json()) as { items?: Book[] };
  const books = (data.items ?? []).filter((b) => b.book_state === 'live');

  const resources = books.map((b) => ({
    title: b.title,
    description: null,
    url: b.meta.html_url,
    source_type: 'textbook',
    source_name: 'OpenStax',
    tags: ['openstax', 'textbook', b.meta.slug],
    category: 'textbook',
    difficulty: 'beginner' as const,
    metadata: {
      published_at: b.meta.first_published_at,
      license: 'CC BY 4.0',
    },
  }));

  const reachable = await filterReachable(resources, (x) => x.url);
  console.log(`OpenStax: ${reachable.length}/${resources.length} reachable`);
  return reachable;
}
