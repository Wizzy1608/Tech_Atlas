import type { Resource } from '../types.js';
import { decodeEntities, stripTags } from '../utils/text.js';
import { fetchTimed } from '../utils/fetch.js';

export async function fetchFreecodecamp(config: Record<string, unknown>): Promise<Resource[]> {
  const limit = Number(config.limit ?? 40);
  const r = await fetchTimed('https://www.freecodecamp.org/news/rss/', {
    headers: { 'User-Agent': 'techatlas-collector' },
  });
  if (!r.ok) throw new Error(`freecodecamp rss ${r.status}`);
  const xml = await r.text();
  const out: Resource[] = [];

  for (const item of xml.split('<item>').slice(1, limit + 1)) {
    const title = decodeEntities(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '').trim();
    const link = item.match(/<link>([^<]+)<\/link>/)?.[1];
    if (!title || !link) continue;
    const description = stripTags(
      decodeEntities(item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? ''),
    ).slice(0, 600);
    const pubDate = item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1];
    out.push({
      title,
      description: description || null,
      url: link,
      source_type: 'article',
      source_name: 'freeCodeCamp',
      tags: ['freecodecamp', 'tutorial'],
      category: /course|tutorial|guide|learn|how to/i.test(title) ? 'tutorial' : 'article',
      difficulty: null,
      metadata: { published_at: pubDate },
    });
  }
  return out;
}
