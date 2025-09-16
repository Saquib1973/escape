// src/components/chat/chat-room.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/hooks/useSocket'
import { Send } from 'lucide-react'

type Message = {
  id: string
  content: string
  type: string
  isRead: boolean
  createdAt: string
  sender: { id: string; username: string | null; image: string | null }
}

export default function ChatRoom({
  conversationId,
}: {
  conversationId: string
}) {
  const { data: session } = useSession()
  const myId = session?.user?.id
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const {
    socket,
    connected,
    joinConversation,
    leaveConversation,
    sendMessage,
    typingStart,
    typingStop,
  } = useSocket()
  const typingTimer = useRef<NodeJS.Timeout | null>(null)

  // Load initial messages
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/chat/conversations/${conversationId}/messages`
      )
      const data = await res.json()
      setMessages(data.items as Message[])
    }
    if (conversationId) load()
  }, [conversationId])

  // Join/leave socket room + event handlers
  useEffect(() => {
    if (!conversationId) return
    joinConversation(conversationId)

    type NewMessage = Message & { conversationId?: string }
    const onNew = (msg: NewMessage) => {
      if (msg && msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg])
      }
    }
    // typing events are currently unused; handler kept for future UI
    const onTyping = () => {}

    socket.on('message:new', onNew)
    socket.on('typing', onTyping)

    return () => {
      leaveConversation(conversationId)
      socket.off('message:new', onNew)
      socket.off('typing', onTyping)
    }
  }, [conversationId, joinConversation, leaveConversation, socket])

  // helper
  async function markRead(conversationId: string) {
    await fetch('/api/chat/messages/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId }),
    })
  }

  // call on mount + focus
  useEffect(() => {
    if (!conversationId) return
    markRead(conversationId)

    const onFocus = () => markRead(conversationId)
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [conversationId])

  // call when messages update and last is from others
  useEffect(() => {
    if (!messages?.length || !conversationId || !myId) return
    const last = messages[messages.length - 1]
    if (last.sender?.id && last.sender.id !== myId) {
      markRead(conversationId)
    }
  }, [messages, conversationId, myId])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (!myId) return
    typingStart(conversationId, myId)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(
      () => typingStop(conversationId, myId),
      1500
    )
  }

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !myId) return
    sendMessage({ conversationId, content: input.trim(), senderId: myId })
    setInput('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 max-h-[calc(100vh-95px)] scrollbar-hide overflow-y-auto space-y-2 px-2 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.sender.id === myId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-3 py-2 rounded-md ${
                m.sender.id === myId
                  ? 'bg-light-green text-white'
                  : 'bg-dark-gray-hover text-gray-200'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={onSend}
        className="sticky bottom-0 z-10 flex gap-2 bg-dark-gray-2 pb-2 pr-2"
      >
        <input
          className="flex-1 w-full px-4 py-3 bg-dark-gray-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-light-green focus:border-transparent resize-none"
          placeholder={connected ? 'Type a message...' : 'Connecting...'}
          value={input}
          onChange={onChange}
          disabled={!connected}
        />
        <button
          className="px-3 py-2 bg-light-green text-white disabled:opacity-50"
          disabled={!connected || !input.trim()}
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  )
}
