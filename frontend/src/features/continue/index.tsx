import { Link } from 'react-router-dom'
import { DifficultyBadge } from '../../components/ResourceCard'
import { useContinueReading } from '../../hooks'
import { clearContinueReading } from '../../lib/continue-reading'

function Continue() {
  const items = useContinueReading()

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
        <p className="text-sm text-slate-400">Resources you open show up here with reading progress.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-indigo-500 hover:underline">
          Start from home →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Continue reading</h1>
        <button
          onClick={clearContinueReading}
          className="text-sm text-slate-400 hover:text-red-500"
        >
          Clear history
        </button>
      </div>
      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {items.map((it) => (
          <Link
            key={it.url}
            to={`/resource/${it.id}`}
            className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{it.title}</div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${it.progress}%` }} />
              </div>
            </div>
            <DifficultyBadge difficulty={it.difficulty} />
            <span className="shrink-0 text-xs text-slate-400">
              {new Date(it.lastViewed).toLocaleDateString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const routes = [{ path: '/continue', element: <Continue /> }]
