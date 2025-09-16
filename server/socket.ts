import http from 'http'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PORT = Number(process.env.SOCKET_PORT || 3001)
const ORIGIN = process.env.NEXTAUTH_URL || 'http://localhost:3000'

const httpServer = http.createServer()
const io = new Server(httpServer, {
  cors: {
    origin: ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

type SendMessagePayload = {
  conversationId: string
  content: string
  senderId: string
  type?: string
}

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  // Join a conversation room
  socket.on('join:conversation', async (conversationId: string) => {
    socket.join(`conv:${conversationId}`)
  })

  // Leave a conversation room
  socket.on('leave:conversation', async (conversationId: string) => {
    socket.leave(`conv:${conversationId}`)
  })

  // Typing indicators
  socket.on('typing:start', (conversationId: string, userId: string) => {
    socket.to(`conv:${conversationId}`).emit('typing', { userId, isTyping: true })
  })
  socket.on('typing:stop', (conversationId: string, userId: string) => {
    socket.to(`conv:${conversationId}`).emit('typing', { userId, isTyping: false })
  })

  // Create + broadcast a new message
  socket.on('message:send', async (data: SendMessagePayload, ack?: (ok: boolean) => void) => {
    try {
      const { conversationId, content, senderId, type = 'text' } = data

      // TODO (auth): validate sender is a participant of conversationId

      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId,
          content,
          type,
        },
        include: {
          sender: {
            select: { id: true, username: true, image: true },
          },
        },
      })

      io.to(`conv:${conversationId}`).emit('message:new', message)
      ack?.(true)
    } catch (err) {
      console.error('message:send error', err)
      ack?.(false)
    }
  })

  // Mark messages as read and notify other participant(s)
  socket.on('message:read', async (conversationId: string, userId: string) => {
    try {
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: userId },
          isRead: false,
        },
        data: { isRead: true },
      })
      io.to(`conv:${conversationId}`).emit('message:read', { conversationId, userId })
    } catch (err) {
      console.error('message:read error', err)
    }
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`)
})