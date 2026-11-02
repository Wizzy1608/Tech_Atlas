import type { Resource } from '../types.js';
import { decodeEntities, stripTags } from '../utils/text.js';
import { fetchTimed } from '../utils/fetch.js';

const decode = (s: string) => stripTags(decodeEntities(s));

async function fromChannels(channelIds: string[]): Promise<Resource[]> {
  const out: Resource[] = [];
  for (const id of channelIds) {
    const r = await fetchTimed(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(id)}`);
    if (!r.ok) throw new Error(`youtube rss ${r.status} for ${id}`);
    const xml = await r.text();
    const head = xml.split('<entry>')[0];
    const channelName = decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'YouTube').replace(/ \(\d+\)$/, '');
    for (const entry of xml.split('<entry>').slice(1)) {
      const vid = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      const title = decode(entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
      if (!vid || !title) continue;
      const description = decode(
        entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? '',
      ).slice(0, 600);
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
      out.push({
        title,
        description: description || null,
        url: `https://www.youtube.com/watch?v=${vid}`,
        source_type: 'youtube',
        source_name: `YouTube · ${channelName}`,
        tags: [],
        category: 'video',
        difficulty: null,
        metadata: { video_id: vid, published },
      });
    }
  }
  return out;
}

async function fromPlaylistFeeds(playlistIds: string[]): Promise<Resource[]> {
  const out: Resource[] = [];
  for (const id of playlistIds) {
    const r = await fetchTimed(`https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(id)}`);
    if (!r.ok) {
      console.warn(`youtube playlist rss ${r.status} for ${id}`);
      continue;
    }
    const xml = await r.text();
    const head = xml.split('<entry>')[0];
    const title = decode(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
    const author = decode(head.match(/<name>([\s\S]*?)<\/name>/)?.[1] ?? 'YouTube');
    const description = decode(head.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? '').slice(0, 600);
    if (!title) continue;
    out.push({
      title,
      description: description || null,
      url: `https://www.youtube.com/playlist?list=${id}`,
      source_type: 'video-course',
      source_name: `YouTube · ${author}`,
      tags: ['playlist'],
      category: 'video-course',
      difficulty: null,
      metadata: { playlist_id: id, videos: xml.split('<entry>').length - 1 },
    });
  }
  return out;
}

// Playlist IDs come free from the channel's /playlists page — no API key.
async function discoverPlaylists(handles: string[], maxPerChannel: number): Promise<string[]> {
  const ids = new Set<string>();
  for (const handle of handles) {
    try {
      const r = await fetchTimed(`https://www.youtube.com/@${encodeURIComponent(handle)}/playlists`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      if (!r.ok) continue;
      const html = await r.text();
      const found = [...new Set([...html.matchAll(/"playlistId":"(PL[\w-]+)"/g)].map((m) => m[1]))];
      for (const id of found.slice(0, maxPerChannel)) ids.add(id);
      await new Promise((res) => setTimeout(res, 500));
    } catch {
      // channel unavailable — try the next one
    }
  }
  return [...ids];
}

export async function fetchYoutube(config: Record<string, unknown>): Promise<Resource[]> {
  const channels = Array.isArray(config.channel_ids) ? (config.channel_ids as string[]) : [];
  const explicit = Array.isArray(config.playlist_ids) ? (config.playlist_ids as string[]) : [];
  const handles = Array.isArray(config.channel_handles) ? (config.channel_handles as string[]) : [];
  const perChannel = Number(config.max_playlists_per_channel ?? 6);
  const discovered = handles.length ? await discoverPlaylists(handles, perChannel) : [];
  return [...(await fromChannels(channels)), ...(await fromPlaylistFeeds([...new Set([...explicit, ...discovered])]))];
}
