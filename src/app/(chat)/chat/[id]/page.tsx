'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import ChatRoom from '@/components/chat/chat-room'

export default function ChatPage() {
  const router = useRouter()
  const pathname = usePathname()
  const conversationId = (pathname?.split('/')?.pop() || '').trim()
  const [ready, setReady] = useState(false)

  // Ensure the route param is present
  useEffect(() => {
    if (!conversationId) {
      router.replace('/chat')
      return
    }
    setReady(true)
  }, [conversationId, router])

  if (!ready) return null

  return (
    <div className="h-full min-h-full flex flex-col md:p-4">
      <div className="flex-1 min-h-0">
        <ChatRoom conversationId={conversationId} />
      </div>
    </div>
  )
}
