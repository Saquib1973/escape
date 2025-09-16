import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/config/auth'
import { prisma } from '@/lib'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const me = session.user.id

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { id: me } },
    },
    include: {
      participants: { select: { id: true, username: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { sender: { select: { id: true, username: true, image: true } } },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Compute unread counts per conversation
  const withUnread = await Promise.all(
    conversations.map(async (c) => {
      const unread = await prisma.message.count({
        where: {
          conversationId: c.id,
          senderId: { not: me },
          isRead: false,
        },
      })
      return { ...c, unread }
    })
  )

  return NextResponse.json(
    withUnread.map((c) => ({
      id: c.id,
      isGroup: c.isGroup,
      participants: c.participants,
      lastMessage: c.messages[0] || null,
      unread: c.unread,
      updatedAt: c.updatedAt,
    }))
  )
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { participantId } = (await req.json()) as { participantId: string }
  const me = session.user.id
  if (!participantId || participantId === me) {
    return NextResponse.json({ error: 'Invalid participant' }, { status: 400 })
  }

  // Find if a direct conversation between the two already exists
  const existing = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      participants: {
        some: { id: me },
      },
      AND: {
        participants: {
          some: { id: participantId },
        },
      },
    },
    include: {
      participants: { select: { id: true, username: true, image: true } },
    },
  })

  if (existing && existing.participants.length === 2) {
    return NextResponse.json(existing)
  }

  const created = await prisma.conversation.create({
    data: {
      isGroup: false,
      participants: {
        connect: [{ id: me }, { id: participantId }],
      },
    },
    include: {
      participants: { select: { id: true, username: true, image: true } },
    },
  })

  return NextResponse.json(created, { status: 201 })
}
