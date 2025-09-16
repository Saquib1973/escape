'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export type UserLite = {
  id: string
  username: string | null
  name: string | null
  image: string | null
}
export type MessageLite = {
  id: string
  content: string
  createdAt: string
  sender: { id: string; username: string | null; image: string | null }
}

export type ConversationItem = {
  id: string
  isGroup: boolean
  participants: UserLite[]
  lastMessage: MessageLite | null
  unread: number
  updatedAt: string
}

export function ConversationRow({
  item,
  myId,
}: {
  item: ConversationItem
  myId?: string
}) {
  const other =
    item.participants.find((p) => p.id !== myId) || item.participants[0]
  return (
    <Link
      key={item.id}
      href={`/chat/${item.id}`}
      className="flex items-center gap-3 p-3 hover:bg-dark-gray-2"
    >
      <Image
        src={other?.image || '/logo.png'}
        alt={other?.username || 'user'}
        width={36}
        unoptimized={other?.image?.includes('dicebear')}
        height={36}
        className="rounded-full bg-light-green object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">
          {other?.name || other?.username}
        </div>
        {item.lastMessage ? (
          <div className="text-sm text-gray-500 truncate">
            {item.lastMessage.sender.id === myId ? 'You: ' : ''}
            {item.lastMessage.content}
          </div>
        ) : (
          <div className="text-sm text-gray-400">No messages yet</div>
        )}
      </div>
      {item.unread > 0 && (
        <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-medium text-white">
          {item.unread}
        </span>
      )}
    </Link>
  )
}

export function ConversationRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-dark-gray-2/60">
      <div className="h-9 w-9 rounded-full bg-dark-gray animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="h-4 w-32 bg-dark-gray rounded animate-pulse mb-2" />
        <div className="h-3 w-48 bg-dark-gray/80 rounded animate-pulse" />
      </div>
      <div className="h-6 w-6 rounded-full bg-dark-gray animate-pulse" />
    </div>
  )
}

export default function ConversationList() {
  const { data: session } = useSession()
  const myId = session?.user?.id
  const [items, setItems] = useState<ConversationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch('/api/chat/conversations', {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('failed')
        const data = (await res.json()) as ConversationItem[]
        setItems(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading)
    return (
      <div className="flex flex-col gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <ConversationRowSkeleton key={i} />
        ))}
      </div>
    )

  if (!items.length)
    return (
      <div className="text-sm text-gray-500">No conversations yet.</div>
    )

  return (
    <div className="">
      {items.map((c) => (
        <ConversationRow key={c.id} item={c} myId={myId} />
      ))}
    </div>
  )
}
