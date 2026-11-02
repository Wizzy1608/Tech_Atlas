import { Link, Route, Routes } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import Layout from './components/Layout'

const modules = import.meta.glob<{ routes?: RouteObject[] }>('./features/*/index.tsx', { eager: true })
const routes = Object.values(modules).flatMap((m) => m.routes ?? [])

function NotFound() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
      <p className="text-3xl">🧭</p>
      <p className="mt-2 text-sm text-slate-400">That page does not exist.</p>
      <Link to="/" className="mt-4 inline-block text-sm text-indigo-500 hover:underline">
        Back to home →
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
