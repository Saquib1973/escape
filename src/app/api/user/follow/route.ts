import { NextResponse } from 'next/server'
import { prisma, getSession } from '@/lib'

type FollowRequestBody = {
  targetUserId: string
  action: 'follow' | 'unfollow'
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const followerId = session.user.id;
    const { targetUserId, action } = await request.json() as FollowRequestBody

    if (!targetUserId || (action !== 'follow' && action !== 'unfollow')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    if (targetUserId === followerId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    // Ensure target user exists and is not deleted
    const targetUser = await prisma.user.findUnique({
      where: {
        id: targetUserId,
        isDeleted: false, // Exclude soft deleted users
      },
      select: { id: true }
    })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'follow') {
      await prisma.follow.upsert({
        where: { followerId_followingId: { followerId, followingId: targetUserId } },
        update: {},
        create: { followerId, followingId: targetUserId },
      })

    } else {
      await prisma.follow.deleteMany({ where: { followerId, followingId: targetUserId } })
    }

    const [followersCount, followingCount, isFollowing] = await Promise.all([
      prisma.follow.count({ where: { followingId: targetUserId } }),
      prisma.follow.count({ where: { followerId: targetUserId } }),
      prisma.follow.findFirst({ where: { followerId, followingId: targetUserId }, select: { id: true } }).then(Boolean),
    ])

    return NextResponse.json({
      ok: true,
      followersCount,
      followingCount,
      isFollowing,
    })
  } catch (error) {
    console.error('[FOLLOW_API_ERROR]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


