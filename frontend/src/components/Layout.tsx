import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useBookmarks } from '../hooks'
import { getDarkMode, setDarkMode } from '../lib/dark-mode'
import DealBanner from './DealBanner'

const links = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/bookmarks', label: 'Bookmarks' },
  { to: '/continue', label: 'Continue' },
]

export default function Layout() {
  const bookmarks = useBookmarks()
  const [dark, setDark] = useState(getDarkMode)

  const toggleDark = () => {
    setDarkMode(!dark)
    setDark(!dark)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <NavLink to="/" className="text-lg font-bold tracking-tight">
            Tech<span className="text-indigo-500">Atlas</span>
          </NavLink>
          <nav className="flex items-center gap-1 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 ${isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'}`
                }
              >
                {l.label}
                {l.to === '/bookmarks' && bookmarks.length > 0 && (
                  <span className="ml-1 rounded-full bg-indigo-500 px-1.5 text-xs text-white">
                    {bookmarks.length}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={toggleDark}
            title="Toggle dark mode"
            className="ml-auto rounded-md border border-slate-200 px-2 py-1 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
        <DealBanner />
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
        TechAtlas — local-first learning hub. Metadata only, all rights belong to source authors.
      </footer>
    </div>
  )
}
