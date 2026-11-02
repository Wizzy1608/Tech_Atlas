import type { Resource } from '../types.js';
import { filterReachable } from '../utils/reachable.js';
import { fetchTimed } from '../utils/fetch.js';

type Textbook = {
  title: string;
  url: string;
  description?: string | null;
  subjects?: { subject_name: string }[];
  license?: string;
  copyright_year?: number;
  formats?: { format_name: string }[];
};

export async function fetchOpenTextbookLibrary(config: Record<string, unknown>): Promise<Resource[]> {
  const pages = Number(config.pages ?? 12);
  const rows: Textbook[] = [];
  for (let page = 1; page <= pages; page++) {
    const r = await fetchTimed(`https://open.umn.edu/opentextbooks/textbooks.json?page=${page}`, {
      headers: { 'User-Agent': 'techatlas-collector' },
    });
    if (!r.ok) throw new Error(`open textbook library ${r.status} page ${page}`);
    const data = (await r.json()) as { data?: Textbook[] };
    const batch = data.data ?? [];
    if (batch.length === 0) break;
    rows.push(...batch);
    await new Promise((res) => setTimeout(res, 300));
  }

  const resources = rows.map((t) => ({
    title: t.title,
    description: (t.description ?? '').slice(0, 600) || null,
    url: t.url,
    source_type: 'textbook',
    source_name: 'Open Textbook Library',
    tags: [...new Set(['open-textbook', ...(t.subjects ?? []).map((s) => (s.subject_name ?? '').toLowerCase()).filter(Boolean)])].slice(0, 6),
    category: 'textbook',
    difficulty: null,
    metadata: {
      license: t.license,
      year: t.copyright_year,
      formats: (t.formats ?? []).map((f) => f.format_name),
    },
  }));

  const reachable = await filterReachable(resources, (x) => x.url);
  console.log(`Open Textbook Library: ${reachable.length}/${resources.length} reachable`);
  return reachable;
}
