export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export default function DifficultyFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const opts = ['all', ...DIFFICULTIES]
  return (
    <div className="flex gap-1.5">
      {opts.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`rounded-full px-3 py-1 text-sm capitalize ${
            value === d
              ? 'bg-indigo-500 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  )
}
