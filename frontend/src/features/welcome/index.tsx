import { useEffect, useMemo, useState } from 'react'
import ContinueReadingRow from '../../components/ContinueReadingRow'
import DifficultyFilter from '../../components/DifficultyFilter'
import ResourceCard from '../../components/ResourceCard'
import SkeletonGrid from '../../components/SkeletonCard'
import SearchBar from '../../components/SearchBar'
import { api, type Resource } from '../../lib/api'

function Home() {
  const [recent, setRecent] = useState<Resource[] | null>(null)
  const [diff, setDiff] = useState('all')

  useEffect(() => {
    api.recent().then(setRecent).catch(() => setRecent([]))
  }, [])

  const shown = useMemo(
    () => (recent ?? []).filter((r) => diff === 'all' || r.difficulty === diff),
    [recent, diff],
  )

  return (
    <div className="space-y-10">
      <section className="pt-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Find your next <span className="text-indigo-500">learning resource</span>
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Curated IT tutorials, repos, courses and cheatsheets — searchable, filterable, no login.
        </p>
        <div className="mx-auto mt-6 max-w-2xl">
          <SearchBar />
        </div>
      </section>

      <ContinueReadingRow />

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Recently collected</h2>
          <DifficultyFilter value={diff} onChange={setDiff} />
        </div>
        {recent === null ? (
          <SkeletonGrid />
        ) : shown.length === 0 ? (
          <p className="text-sm text-slate-400">Nothing with that difficulty yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((r) => (
              <ResourceCard key={r.id} data={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export const routes = [
  { path: '/', element: <Home /> },
]
