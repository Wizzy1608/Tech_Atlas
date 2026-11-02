import type { Resource } from '../types.js';
import { filterReachable } from '../utils/reachable.js';
import { stripTags } from '../utils/text.js';
import { fetchTimed } from '../utils/fetch.js';

const SOURCE = 'https://raw.githubusercontent.com/fmhy/edit/main/docs/educational.md';

// Only the IT learning sections. The "Downloading" section is pirated course dumps - never imported.
const ALLOWED_SECTIONS = new Set(['Courses', 'Developer Learning']);

const SKIP_HOST = /(^|\.)(youtube\.com|youtu\.be|reddit\.com|t\.me|telegram\.me|discord\.gg|discord\.com|rentry\.co|rentry\.org|docs\.google\.com|drive\.google\.com|github\.com|gitlab\.com|twitter\.com|x\.com|instagram\.com|tiktok\.com|play\.google\.com|apps\.apple\.com)$/i;
const SKIP_LABELS = /^(discord|github|telegram|subreddit|youtube|downloader|torrent|use vpn|index|archives?|videos?|2|3|4|5|pt-br|cn)$/i;

const cleanText = (s: string) =>
  stripTags(
    s
      .replace(/[\u200B-\u200F\u2060-\u2064\uFEFF]/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/\*\*/g, '')
      .replace(/^[*\s]+/, '')
      .replace(/\s+/g, ' '),
  ).trim();

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Headings are decorated: "# ► Courses", "## ▷ Streaming".
const heading = (s: string) => cleanText(s).replace(/^[^\p{L}\p{N}]+/u, '');

export async function fetchFmhy(config: Record<string, unknown>): Promise<Resource[]> {
  const sections = new Set(
    Array.isArray(config.sections) ? (config.sections as string[]) : [...ALLOWED_SECTIONS],
  );
  const r = await fetchTimed(SOURCE, { headers: { 'User-Agent': 'techatlas-collector' } });
  if (!r.ok) throw new Error(`fmhy source ${r.status}`);
  const md = await r.text();

  const out = new Map<string, Resource>();
  let h1 = '';
  let h2 = '';

  for (const line of md.split('\n')) {
    const top = line.match(/^#\s+(.*)/);
    if (top) {
      h1 = heading(top[1]);
      h2 = '';
      continue;
    }
    const sub = line.match(/^##\s+(.*)/);
    if (sub) {
      h2 = heading(sub[1]);
      continue;
    }
    if (!line.startsWith('*') || !sections.has(h1) || /downloading/i.test(h2)) continue;

    for (const m of line.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)) {
      const label = cleanText(m[1]);
      const url = m[2].replace(/#.*$/, '');
      if (!label || SKIP_LABELS.test(label)) continue;
      let host = '';
      try {
        host = new URL(url).hostname;
      } catch {
        continue;
      }
      if (SKIP_HOST.test(host)) continue;

      const note = cleanText(line.replace(/^[^[]*/, '')).slice(0, 600);
      const description = note.replace(/^.*?\s[-–—]\s/, '') || note;
      // Keep learning material; drop tool listings (IDEs, notebooks, extensions).
      if (!/learn|course|tutorial|guide|lesson|practice|book|curriculum|roadmap|lecture|exercise|challenge|study|training|bootcamp|interactive|educational|resource/i.test(description)) continue;

      out.set(url, {
        title: label,
        description: description.slice(0, 600) || null,
        url,
        source_type: 'course',
        source_name: host.replace(/^www\./, ''),
        tags: ['fmhy', slug(h2 || h1)].filter(Boolean),
        category: 'course',
        difficulty: null,
        metadata: { curated: false, fmhy_section: h2 || h1 },
      });
    }
  }

  const resources = [...out.values()];
  const reachable = await filterReachable(resources, (x) => x.url);
  console.log(`FMHY: ${reachable.length}/${resources.length} reachable`);
  return reachable;
}
