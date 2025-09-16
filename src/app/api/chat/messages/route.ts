// src/app/api/chat/messages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/config/auth'
import { prisma } from '@/lib'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const {
    conversationId,
    content,
    type = 'text',
  } = (await req.json()) as {
    conversationId: string
    content: string
    type?: string
  }

  if (!conversationId || !content?.trim()) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Ensure the user is a participant
  const isParticipant = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { id: session.user.id } },
    },
    select: { id: true },
  })
  if (!isParticipant)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content: content.trim(),
      type,
    },
    include: {
      sender: { select: { id: true, username: true, image: true } },
    },
  })

  return NextResponse.json(message, { status: 201 })
}
