import type { Resource } from '../types.js';
import { fetchTimed } from '../utils/fetch.js';

export async function fetchGithubRepos(config: Record<string, unknown>): Promise<Resource[]> {
  const repos = Array.isArray(config.repos) ? (config.repos as string[]) : [];
  const out: Resource[] = [];
  for (const name of repos) {
    const r = await fetchTimed(`https://api.github.com/repos/${name}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'techatlas-collector' },
    });
    if (!r.ok) {
      if (r.status === 404) continue; // curated list rot — skip quietly
      throw new Error(`github repos ${r.status} for ${name}`);
    }
    const i = (await r.json()) as {
      full_name: string;
      name: string;
      html_url: string;
      description: string | null;
      stargazers_count: number;
      topics?: string[];
    };
    out.push({
      title: i.name.replace(/-/g, ' '),
      description: i.description,
      url: i.html_url,
      source_type: 'path',
      source_name: `GitHub · ${i.full_name}`,
      tags: (i.topics ?? []).slice(0, 6),
      category: 'path',
      difficulty: null,
      metadata: { stars: i.stargazers_count, repo: i.full_name },
    });
  }
  return out;
}
