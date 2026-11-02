export type ContinueItem = {
  url: string
  title: string
  id: string
  difficulty: string | null
  lastViewed: string
  progress: number
}

const KEY = 'techatlas:continue-reading'
const MAX = 20

const listeners = new Set<() => void>()
let cache: ContinueItem[] | null = null
export function subscribeContinue(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}
const emit = () => {
  cache = null
  listeners.forEach((l) => l())
}

export function getContinueReading(): ContinueItem[] {
  if (!cache) {
    let v: ContinueItem[] = []
    try {
      v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    } catch {
      /* keep [] */
    }
    cache = v
  }
  return cache
}

export function trackVisit(item: Omit<ContinueItem, 'lastViewed' | 'progress'>) {
  const list = getContinueReading().filter((x) => x.url !== item.url)
  list.unshift({ ...item, lastViewed: new Date().toISOString(), progress: 5 })
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
  emit()
}

export function setProgress(url: string, progress: number) {
  const list = getContinueReading().map((x) =>
    x.url === url ? { ...x, progress: Math.min(100, Math.max(x.progress, progress)) } : x,
  )
  localStorage.setItem(KEY, JSON.stringify(list))
  emit()
}

export function clearContinueReading() {
  localStorage.removeItem(KEY)
  emit()
}
