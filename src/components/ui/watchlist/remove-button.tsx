'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RemoveWatchlistButton({ contentId }: { contentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onRemove = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/user/watchlist/${contentId}`, { method: 'DELETE' })
      if (!res.ok) {
        // Optionally show a toast
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={onRemove}
      disabled={loading}
      className="px-3 py-1 bg-dark-gray hover:bg-dark-gray-hover text-gray-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? 'Removing...' : 'Remove'}
    </button>
  )
}


