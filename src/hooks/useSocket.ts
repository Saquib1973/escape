'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket() {
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const socket = useMemo(() => {
    if (!socketRef.current) {
      const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
      socketRef.current = io(url, { transports: ['websocket'] })
    }
    return socketRef.current
  }, [])

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [socket])

  const joinConversation = (conversationId: string) =>
    socket.emit('join:conversation', conversationId)

  const leaveConversation = (conversationId: string) =>
    socket.emit('leave:conversation', conversationId)

  const sendMessage = (
    data: {
      conversationId: string
      content: string
      senderId: string
      type?: string
    },
    ack?: (ok: boolean) => void
  ) => socket.emit('message:send', data, ack)

  const typingStart = (conversationId: string, userId: string) =>
    socket.emit('typing:start', conversationId, userId)

  const typingStop = (conversationId: string, userId: string) =>
    socket.emit('typing:stop', conversationId, userId)

  return {
    socket,
    connected,
    joinConversation,
    leaveConversation,
    sendMessage,
    typingStart,
    typingStop,
  }
}
