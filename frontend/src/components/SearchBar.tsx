import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ initial = '' }: { initial?: string }) {
  const [q, setQ] = useState(initial)
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <form onSubmit={submit} className="flex w-full gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='Search resources…  (try "bash scripting", "docker", "wirshark")'
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
      />
      <button
        type="submit"
        className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-600"
      >
        Search
      </button>
    </form>
  )
}
