import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DifficultyBadge } from '../../components/ResourceCard'
import { api, type Resource } from '../../lib/api'
import { isBookmarked, toggleBookmark } from '../../lib/bookmarks'
import { setProgress, trackVisit } from '../../lib/continue-reading'

function ResourceDetail() {
  const { id } = useParams()
  const [res, setRes] = useState<Resource | null | 'missing'>(null)
  const [marked, setMarked] = useState(false)

  useEffect(() => {
    if (!id) return
    setRes(null)
    api
      .resource(id)
      .then((r) => {
        setRes(r)
        setMarked(isBookmarked(r.url))
        trackVisit({
          url: r.url,
          title: r.title,
          id: r.id,
          difficulty: r.difficulty ?? null,
        })
      })
      .catch(() => setRes('missing'))
  }, [id])

  if (res === null) {
    return <div className="animate-pulse h-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
  }
  if (res === 'missing') {
    return (
      <div className="text-center text-sm text-slate-400">
        Resource not found. <Link to="/" className="text-indigo-500 hover:underline">Back home</Link>
      </div>
    )
  }

  const meta = (res.metadata ?? {}) as Record<string, unknown>

  const onStar = () => {
    toggleBookmark({
      url: res.url,
      title: res.title,
      id: res.id,
      difficulty: res.difficulty ?? null,
      source_type: res.source_type,
    })
    setMarked(!marked)
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link to="/browse" className="text-sm text-slate-400 hover:text-indigo-500">← Back to browse</Link>

      <header className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <span className="text-4xl">{res.domain_icon ?? '🔗'}</span>
          <div className="flex items-center gap-2">
            <DifficultyBadge difficulty={res.difficulty} />
            <button
              onClick={onStar}
              className={`rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:border-indigo-300 dark:border-slate-700 ${marked ? 'text-amber-500' : 'text-slate-400'}`}
            >
              {marked ? '★ Saved' : '☆ Save'}
            </button>
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setProgress(res.url, 100)}
              className="rounded-md bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-600"
            >
              Open ↗
            </a>
          </div>
        </div>
        <h1 className="text-3xl font-bold leading-tight">{res.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <span>{res.source_name ?? res.source_type}</span>
          {res.domain && <span>· {res.domain_icon} {res.domain}</span>}
          {res.category && <span>· {res.category}</span>}
          {typeof meta.stars === 'number' && <span>· ★ {meta.stars.toLocaleString()}</span>}
          {typeof meta.forks === 'number' && <span>· ⑂ {meta.forks.toLocaleString()}</span>}
        </div>
      </header>

      {res.description && (
        <p className="whitespace-pre-wrap text-slate-600 leading-relaxed dark:text-slate-300">
          {res.description}
        </p>
      )}

      {res.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {res.tags.map((t) => (
            <Link
              key={t}
              to={`/search?q=${encodeURIComponent(t)}`}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 font-semibold">Metadata</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-slate-500 dark:text-slate-400">
          <dt className="text-slate-400">Collected</dt>
          <dd>{new Date(res.collected_at).toLocaleString()}</dd>
          {Object.entries(meta)
            .slice(0, 8)
            .map(([k, v]) => (
              <Fragment key={k}>
                <dt className="text-slate-400">{k}</dt>
                <dd>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
              </Fragment>
            ))}
        </dl>
      </div>
    </article>
  )
}

export const routes = [{ path: '/resource/:id', element: <ResourceDetail /> }]
