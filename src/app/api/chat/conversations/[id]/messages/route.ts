// src/app/api/chat/conversations/[id]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/config/auth'
import { prisma } from '@/lib'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: conversationId } = await params
  const searchParams = req.nextUrl.searchParams
  const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100)
  const cursor = searchParams.get('cursor')

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

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: {
      sender: { select: { id: true, username: true, image: true } },
    },
  })

  const hasMore = messages.length > limit
  const data = hasMore ? messages.slice(0, -1) : messages
  const nextCursor = hasMore ? data[data.length - 1]?.id : null

  // Return ascending order to render easily (oldest first)
  return NextResponse.json({
    items: data.reverse(),
    nextCursor,
  })
}
