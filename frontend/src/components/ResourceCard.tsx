import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isBookmarked, toggleBookmark } from '../lib/bookmarks'

const SOURCE_ICONS: Record<string, string> = {
  github_repo: '🐙',
  github_topic: '🐙',
  path: '🧭',
  youtube: '▶️',
  'video-course': '▶️',
  article: '📄',
  practice: '🧪',
  tutorial: '📘',
  textbook: '📖',
  documentation: '📚',
  course: '🎓',
  cheatsheet: '📜',
  tool: '🧰',
  link: '🔗',
}

const DIFF_STYLES: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
}

type CardData = {
  id: string
  url: string
  title: string
  description?: string | null
  domain?: string | null
  domain_icon?: string | null
  tags?: string[]
  difficulty?: string | null
  source_type?: string
  source_name?: string | null
  collected_at?: string
}

export function DifficultyBadge({ difficulty }: { difficulty?: string | null }) {
  if (!difficulty) return null
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFF_STYLES[difficulty] ?? ''}`}>
      {difficulty}
    </span>
  )
}

export default function ResourceCard({ data }: { data: CardData }) {
  const [marked, setMarked] = useState(() => isBookmarked(data.url))
  const isNew = Date.now() - new Date(data.collected_at ?? 0).getTime() < 7 * 864e5

  const onStar = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleBookmark({
      url: data.url,
      title: data.title,
      id: data.id,
      difficulty: data.difficulty ?? null,
      source_type: data.source_type ?? 'link',
    })
    setMarked(!marked)
  }

  return (
    <Link
      to={`/resource/${data.id}`}
      className="group flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xl">{data.domain_icon ?? SOURCE_ICONS[data.source_type ?? ''] ?? '🔗'}</span>
        <div className="flex items-center gap-1.5">
          {isNew && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">New</span>}
          <DifficultyBadge difficulty={data.difficulty} />
          <button
            onClick={onStar}
            title={marked ? 'Remove bookmark' : 'Save bookmark'}
            className={`text-lg ${marked ? '' : 'opacity-30 group-hover:opacity-100'}`}
          >
            {marked ? '★' : '☆'}
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold leading-snug group-hover:text-indigo-500">{data.title}</h3>
        {data.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{data.description}</p>
        )}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs text-slate-400">
          {SOURCE_ICONS[data.source_type ?? ''] ?? '🔗'} {data.source_name ?? data.source_type ?? 'link'}
        </span>
        {(data.tags ?? []).slice(0, 3).map((t) => (
          <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {t}
          </span>
        ))}
      </div>
    </Link>
  )
}
