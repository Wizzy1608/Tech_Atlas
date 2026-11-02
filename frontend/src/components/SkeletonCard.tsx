export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-5 w-6 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-3 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-1 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}

export default function SkeletonGrid({ n = 8 }: { n?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: n }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
