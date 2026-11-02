import { Link } from 'react-router-dom'
import ResourceCard from '../../components/ResourceCard'
import { useBookmarks } from '../../hooks'

function Bookmarks() {
  const bookmarks = useBookmarks()

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
        <p className="text-3xl">★</p>
        <p className="mt-2 text-sm text-slate-400">
          No bookmarks yet — tap the star on any card. Saved locally in this browser.
        </p>
        <Link to="/browse" className="mt-4 inline-block text-sm text-indigo-500 hover:underline">
          Browse resources →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Bookmarks <span className="text-base font-normal text-slate-400">({bookmarks.length})</span></h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((b) => (
          <ResourceCard key={b.url} data={{ ...b, collected_at: b.savedAt }} />
        ))}
      </div>
    </div>
  )
}

export const routes = [{ path: '/bookmarks', element: <Bookmarks /> }]
