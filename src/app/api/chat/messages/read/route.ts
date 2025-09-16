// src/app/api/chat/messages/read/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/config/auth'
import { prisma } from '@/lib'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { conversationId } = (await req.json()) as { conversationId: string }
  if (!conversationId)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

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

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: session.user.id },
      isRead: false,
    },
    data: { isRead: true },
  })

  return NextResponse.json({ ok: true })
}
