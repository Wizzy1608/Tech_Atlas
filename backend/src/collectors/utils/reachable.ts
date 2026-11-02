// Only store resources whose URLs actually respond — dead links pollute the hub.
const cache = new Map<string, boolean>();
const CONCURRENCY = 8;
const TIMEOUT_MS = 8000;

async function probe(url: string): Promise<boolean> {
  if (cache.has(url)) return cache.get(url)!;
  let ok = false;
  try {
    const head = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; techatlas-collector)' },
    });
    ok = head.ok || (head.status >= 300 && head.status < 400);
    if (!ok && (head.status === 405 || head.status === 403)) {
      const get = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; techatlas-collector)', Range: 'bytes=0-2048' },
      });
      ok = get.ok || (get.status >= 300 && get.status < 400);
    }
  } catch {
    ok = false;
  }
  cache.set(url, ok);
  return ok;
}

export async function filterReachable<T>(items: T[], getUrl: (item: T) => string): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    const checks = await Promise.all(batch.map(async (item) => ((await probe(getUrl(item))) ? item : null)));
    for (const c of checks) if (c) results.push(c);
  }
  return results;
}
