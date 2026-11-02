import { useEffect, useState } from 'react'
import { api, type Deal } from '../lib/api'

export default function DealBanner() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [i, setI] = useState(0)
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('techatlas:deals-dismissed') === 'true',
  )

  useEffect(() => {
    api.deals().then(setDeals).catch(() => {})
  }, [])

  useEffect(() => {
    if (deals.length > 1) {
      const t = setInterval(() => setI((x) => (x + 1) % deals.length), 8000)
      return () => clearInterval(t)
    }
  }, [deals.length])

  if (dismissed || deals.length === 0) return null
  const deal = deals[i % deals.length]

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-center text-sm text-white">
      🏷️{' '}
      <a href={deal.url} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
        {deal.title}
      </a>
      {Number(deal.discounted_price) === 0 || deal.discount_percent === 100 ? (
        <span className="ml-1 font-bold">FREE</span>
      ) : null}
      {deal.discount_percent != null && deal.discount_percent < 100 && (
        <span className="ml-1 font-bold">-{deal.discount_percent}%</span>
      )}
      {deal.discount_percent == null && Number(deal.discounted_price) > 0 && (
        <span className="ml-1 font-bold">{deal.discounted_price}</span>
      )}
      {deal.description && <span className="hidden sm:inline"> — {deal.description}</span>}
      <button
        onClick={() => {
          sessionStorage.setItem('techatlas:deals-dismissed', 'true')
          setDismissed(true)
        }}
        className="ml-3 rounded px-1.5 opacity-70 hover:opacity-100"
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
