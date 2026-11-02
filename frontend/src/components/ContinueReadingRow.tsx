import { Link } from 'react-router-dom'
import { useContinueReading } from '../hooks'

export default function ContinueReadingRow() {
  const items = useContinueReading()
  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Continue reading</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.slice(0, 10).map((it) => (
          <Link
            key={it.url}
            to={`/resource/${it.id}`}
            className="w-56 shrink-0 rounded-lg border border-slate-200 bg-white p-3 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="truncate text-sm font-medium">{it.title}</div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${it.progress}%` }} />
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {it.difficulty} · {new Date(it.lastViewed).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
