import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import UserDetailScreen from '@/components/user/user-detail-screen'
import { getPostsWithPosters } from '@/app/(user)/post/actions'

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params

  const session = await getSession()
  const viewerId = session?.user?.id || null

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          rating: true,
          isSpoiler: true,
          createdAt: true,
          user: { select: { name: true, image: true } },
          likes: { select: { id: true, userId: true } },
          _count: { select: { comments: true } },
          movie: { select: { id: true, type: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  let initialIsFollowing = false
  if (viewerId && viewerId !== user.id) {
    const rel = await prisma.follow.findFirst({
      where: { followerId: viewerId, followingId: user.id },
      select: { id: true },
    })
    initialIsFollowing = Boolean(rel)
  }

  const postsWithPosters = await getPostsWithPosters(user.posts)

  return (
    <UserDetailScreen
      userId={user.id}
      viewerId={viewerId}
      name={user.name || user.username}
      username={user.username}
      image={user.image || undefined}
      followersCount={user._count.followers}
      followingCount={user._count.following}
      initialIsFollowing={initialIsFollowing}
      posts={postsWithPosters}
    />
  )
}

export default page
