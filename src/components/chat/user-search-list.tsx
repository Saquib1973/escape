'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useOpenConversation } from '@/hooks/useOpenConversation'
import { useDebounce } from '@/hooks/useDebounce'

type UserLite = {
  id: string
  username: string | null
  name: string | null
  image: string | null
}

export default function UserSearchList({ query }: { query: string }) {
  const { openConversation, openingId } = useOpenConversation()
  const [results, setResults] = useState<UserLite[]>([])
  const [loading, setLoading] = useState(false)
  const debounced = useDebounce(query, 300)
  const latestRequestIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const requestId = ++latestRequestIdRef.current

    async function run() {
      const trimmed = debounced.trim()
      if (!trimmed) {
        if (latestRequestIdRef.current === requestId) {
          setResults([])
          setLoading(false)
        }
        return
      }

      // Only the latest request toggles loading
      if (latestRequestIdRef.current === requestId) setLoading(true)

      try {
        const res = await fetch(
          `/api/user/search?query=${encodeURIComponent(trimmed)}`,
          { cache: 'no-store', signal: controller.signal }
        )
        if (!res.ok) throw new Error('search failed')
        const data = (await res.json()) as UserLite[]
        if (latestRequestIdRef.current === requestId) setResults(data)
      } catch (err: unknown) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          if (latestRequestIdRef.current === requestId) setResults([])
        }
      } finally {
        if (latestRequestIdRef.current === requestId) setLoading(false)
      }
    }

    run()

    return () => {
      controller.abort()
    }
  }, [debounced])

  const hasQuery = debounced.trim().length > 0

  return (
    <ul className="">
      {loading && (
        <li className="p-0">
          <div className="flex flex-col gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <UserSearchRowSkeleton key={i} />
            ))}
          </div>
        </li>
      )}

      {!loading && hasQuery && results.length === 0 && (
        <li className="p-3 text-sm text-gray-500">No users found.</li>
      )}

      {results.map((u) => (
        <li key={u.id} className="p-0">
          <UserSearchRow
            user={u}
            isOpening={openingId === u.id}
            onOpen={() => openConversation(u.id)}
          />
        </li>
      ))}
    </ul>
  )
}

function UserSearchRow({
  user,
  isOpening,
  onOpen,
}: {
  user: UserLite
  isOpening: boolean
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={isOpening}
      className="flex w-full items-center gap-3 p-3 text-left hover:bg-dark-gray-2 disabled:opacity-50"
    >
      <Image
        src={user.image || '/logo.png'}
        alt={user.username || 'user'}
        width={36}
        height={36}
        unoptimized={user.image?.includes('dicebear')}
        className="rounded-full bg-light-green object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-medium">{user.name || user.username}</div>
        <div className="truncate text-xs text-gray-500">@{user.username}</div>
      </div>
      <span className="text-xs text-gray-400">{isOpening ? 'Opening…' : 'Open'}</span>
    </button>
  )
}

function UserSearchRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-dark-gray-2/60">
      <div className="h-9 w-9 rounded-full bg-dark-gray animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="h-4 w-32 bg-dark-gray rounded animate-pulse mb-2" />
        <div className="h-3 w-48 bg-dark-gray/80 rounded animate-pulse" />
      </div>
      <div className="h-6 w-10 rounded-full bg-dark-gray animate-pulse" />
    </div>
  )
}