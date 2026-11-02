import { useEffect, useState } from 'react'
import DifficultyFilter from '../../components/DifficultyFilter'
import ResourceCard from '../../components/ResourceCard'
import SkeletonGrid from '../../components/SkeletonCard'
import { api, type Resource } from '../../lib/api'

const PAGE = 60

function Browse() {
  const [items, setItems] = useState<Resource[] | null>(null)
  const [total, setTotal] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cats, setCats] = useState<string[]>([])
  const [doms, setDoms] = useState<{ domain: string; domain_icon: string | null }[]>([])
  const [diff, setDiff] = useState('all')
  const [domain, setDomain] = useState('all')
  const [category, setCategory] = useState('all')
  const [exclude, setExclude] = useState(false)

  useEffect(() => {
    api.meta().then((m) => {
      setCats(m.categories)
      setDoms(m.domains)
    }).catch(() => {})
  }, [])

  const params = (offset: number) => {
    const p: Record<string, string> = { limit: String(PAGE), offset: String(offset) }
    if (diff !== 'all') p.difficulty = diff
    if (domain !== 'all') p.domain = domain
    if (category !== 'all') p.category = (exclude ? '!' : '') + category
    return p
  }

  useEffect(() => {
    setItems(null)
    let alive = true
    api
      .resources(params(0))
      .then((r) => {
        if (!alive) return
        setItems(r.items)
        setTotal(r.total)
      })
      .catch(() => alive && setItems([]))
    return () => {
      alive = false
    }
  }, [diff, domain, category, exclude])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const r = await api.resources(params(items?.length ?? 0))
      setItems((prev) => [...(prev ?? []), ...r.items])
      setTotal(r.total)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Browse</h1>
        <DifficultyFilter value={diff} onChange={setDiff} />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All domains</option>
          {doms.map((d) => (
            <option key={d.domain} value={d.domain}>
              {d.domain_icon ?? ''} {d.domain}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All types</option>
          {cats.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-slate-500">
          <input
            type="checkbox"
            checked={exclude}
            onChange={(e) => setExclude(e.target.checked)}
            disabled={category === 'all'}
          />
          exclude this type <code className="rounded bg-slate-100 px-1">!prefix</code>
        </label>
        {items && <span className="ml-auto text-slate-400">{total} resources</span>}
      </div>

      {items === null ? (
        <SkeletonGrid n={9} />
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-400">No resources match those filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <ResourceCard key={r.id} data={r} />
          ))}
        </div>
      )}

      {items && items.length > 0 && items.length < total && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            {loadingMore ? 'Loading…' : `Load more (${items.length} of ${total})`}
          </button>
        </div>
      )}
    </div>
  )
}

export const routes = [{ path: '/browse', element: <Browse /> }]
