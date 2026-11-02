export type Bookmark = {
  url: string
  title: string
  id: string
  difficulty: string | null
  source_type: string
  savedAt: string
}

const KEY = 'techatlas:bookmarks'

const listeners = new Set<() => void>()
let cache: Bookmark[] | null = null
export function subscribeBookmarks(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}
const emit = () => {
  cache = null
  listeners.forEach((l) => l())
}

export function getBookmarks(): Bookmark[] {
  if (!cache) {
    let v: Bookmark[] = []
    try {
      v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    } catch {
      /* keep [] */
    }
    cache = v
  }
  return cache
}

export function isBookmarked(url: string): boolean {
  return getBookmarks().some((b) => b.url === url)
}

export function toggleBookmark(b: Omit<Bookmark, 'savedAt'>): boolean {
  const list = getBookmarks()
  const idx = list.findIndex((x) => x.url === b.url)
  if (idx >= 0) {
    list.splice(idx, 1)
  } else {
    list.unshift({ ...b, savedAt: new Date().toISOString() })
  }
  localStorage.setItem(KEY, JSON.stringify(list))
  emit()
  return idx < 0
}
