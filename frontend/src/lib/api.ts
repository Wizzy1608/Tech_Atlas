// Static data layer: the catalogue is exported at build time by the backend
// (`npm run export`) and shipped as /catalogue.json. Same API surface as
// before, so no page or hook had to change.

export type Resource = {
  id: string
  title: string
  description: string | null
  url: string
  source_type: string
  source_name: string | null
  tags: string[]
  category: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null
  domain: string | null
  domain_icon: string | null
  metadata: Record<string, unknown>
  collected_at: string
}

export type Deal = {
  id: string
  title: string
  description: string | null
  url: string
  provider: string
  original_price: string | number | null
  discounted_price: string | number | null
  discount_percent: number | null
  valid_until: string | null
}

export type SearchResult = {
  results: Resource[]
  related: Resource[]
  total: number
}

export type Meta = {
  categories: string[]
  domains: { domain: string; domain_icon: string | null }[]
}

type Catalogue = Meta & {
  generated_at: string
  resources: Resource[]
}

let pending: Promise<Catalogue> | null = null

function load(): Promise<Catalogue> {
  pending ??= fetch('/catalogue.json')
    .then((r) => {
      if (!r.ok) throw new Error('catalogue unavailable')
      return r.json() as Promise<Catalogue>
    })
    .catch((err) => {
      pending = null
      throw err
    })
  return pending
}

const FILTERS = ['category', 'domain', 'difficulty', 'source_type', 'source_name'] as const
type FilterKey = (typeof FILTERS)[number]

// Mirrors the SQL filters, including `!value` and the fact that a negated
// filter keeps NULL rows (IS DISTINCT FROM).
function match(value: string | null, want: string) {
  const negate = want.startsWith('!')
  const target = negate ? want.slice(1) : want
  return negate ? value !== target : value === target
}

function words(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
}

// True when the two words are at most one insertion/deletion/substitution apart.
function near(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0
  let j = 0
  let edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++
      j++
      continue
    }
    if (++edits > 1) return false
    if (a.length > b.length) i++
    else if (b.length > a.length) j++
    else {
      i++
      j++
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1
}

// Replaces Postgres full-text search: title beats tags beats description, and
// a one-letter typo still matches ("wirshark" -> Wireshark).
function score(r: Resource, tokens: string[]) {
  const title = words(r.title)
  const tags = words(r.tags.join(' '))
  const rest = words(
    [r.description ?? '', r.source_name ?? '', r.category ?? '', r.domain ?? ''].join(' '),
  )
  let total = 0
  for (const t of tokens) {
    let s = title.includes(t) ? 8 : title.some((w) => w.startsWith(t)) ? 6 : 0
    if (!s && tags.some((w) => w === t || w.startsWith(t))) s = 3
    if (!s && rest.some((w) => w === t || w.startsWith(t))) s = 2
    if (!s && t.length >= 4 && [...title, ...tags, ...rest].some((w) => near(w, t))) s = 1
    if (!s) return 0
    total += s
  }
  return total
}

function related(results: Resource[], all: Resource[]) {
  const ids = new Set(results.map((r) => r.id))
  const tags = new Set(results.flatMap((r) => r.tags))
  return all
    .filter((r) => !ids.has(r.id) && r.tags.filter((t) => tags.has(t)).length >= 2)
    .slice(0, 10)
}

export const api = {
  meta: async (): Promise<Meta> => {
    const { categories, domains } = await load()
    return { categories, domains }
  },

  resources: async (params: Record<string, string> = {}) => {
    const { resources } = await load()
    const limit = Math.min(Math.max(Number(params.limit) || 50, 1), 200)
    const offset = Math.max(Number(params.offset) || 0, 0)
    const items = resources.filter((r) =>
      FILTERS.every((key: FilterKey) => !params[key] || match(r[key], params[key])),
    )
    return { items: items.slice(offset, offset + limit), total: items.length }
  },

  resource: async (id: string): Promise<Resource> => {
    const { resources } = await load()
    const found = resources.find((r) => r.id === id)
    if (!found) throw new Error('not found')
    return found
  },

  recent: async (): Promise<Resource[]> => (await load()).resources.slice(0, 20),

  search: async (q: string, diff?: string): Promise<SearchResult> => {
    const tokens = words(q)
    if (tokens.length === 0) return { results: [], related: [], total: 0 }
    const { resources } = await load()
    const scored = resources
      .filter((r) => !diff || r.difficulty === diff)
      .map((r) => ({ r, score: score(r, tokens) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || b.r.collected_at.localeCompare(a.r.collected_at))
    const results = scored.slice(0, 20).map((x) => x.r)
    return { results, related: related(results, resources), total: scored.length }
  },

  // Deals were already empty in the database; kept so DealBanner does not change.
  deals: async (): Promise<Deal[]> => [],
}
