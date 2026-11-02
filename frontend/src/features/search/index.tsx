import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DifficultyFilter from '../../components/DifficultyFilter'
import ResourceCard from '../../components/ResourceCard'
import SkeletonGrid from '../../components/SkeletonCard'
import SearchBar from '../../components/SearchBar'
import { api, type SearchResult } from '../../lib/api'

function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const diff = params.get('diff') ?? 'all'
  const [data, setData] = useState<SearchResult | null>(null)

  useEffect(() => {
    if (!q) {
      setData(null)
      return
    }
    setData(null)
    api.search(q, diff === 'all' ? undefined : diff).then(setData).catch(() => setData({ results: [], related: [], total: 0 }))
  }, [q, diff])

  const setDiff = (d: string) => {
    const next = new URLSearchParams(params)
    if (d === 'all') next.delete('diff')
    else next.set('diff', d)
    setParams(next)
  }

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-2xl">
        <SearchBar initial={q} />
      </div>

      {!q && <p className="text-center text-sm text-slate-400">Type something to search titles, tags and descriptions.</p>}

      {q && data === null && <SkeletonGrid n={6} />}

      {data && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-semibold">
              {data.total} result{data.total === 1 ? '' : 's'} for <span className="text-indigo-500">“{q}”</span>
            </h1>
            <DifficultyFilter value={diff} onChange={setDiff} />
          </div>

          {data.results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
              Nothing matched. Try a shorter word — search is fuzzy, e.g. <code>wirshark</code> still finds Wireshark.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.results.map((r) => (
                <ResourceCard key={r.id} data={r} />
              ))}
            </div>
          )}

          {data.related.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Related tags</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.related.map((r) => (
                  <ResourceCard key={r.id} data={r} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

export const routes = [{ path: '/search', element: <Search /> }]
