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

async function request(path: string): Promise<Response> {
  const r = await fetch(`/api${path}`)
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText)
  return r
}

async function call<T>(path: string): Promise<T> {
  return (await request(path)).json()
}

export const api = {
  meta: () => call<Meta>('/meta'),
  resources: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString()
    const r = await request(`/resources${qs ? `?${qs}` : ''}`)
    const items = (await r.json()) as Resource[]
    return { items, total: Number(r.headers.get('x-total-count') ?? items.length) }
  },
  resource: (id: string) => call<Resource>(`/resources/${id}`),
  recent: () => call<Resource[]>('/recent'),
  search: (q: string, diff?: string) =>
    call<SearchResult>(`/search?q=${encodeURIComponent(q)}${diff ? `&diff=${diff}` : ''}`),
  deals: () => call<Deal[]>('/deals'),
}
