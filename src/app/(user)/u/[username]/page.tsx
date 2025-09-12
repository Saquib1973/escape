import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import UserDetailScreen from '@/components/user/user-detail-screen'
import type { GenericPost } from '@/types/post'
import { getPosterUrl } from '@/lib/tmdb'

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
          movie: { select: { id: true, type: true, posterPath: true } },
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

  const postsWithPosters: GenericPost[] = user.posts.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    rating: p.rating,
    isSpoiler: p.isSpoiler,
    createdAt: p.createdAt,
    posterUrl: getPosterUrl(p.movie?.posterPath ?? null, 'w500') ?? '/logo.png',
    user: {
      name: p.user?.name ?? null,
      image: p.user?.image ?? null,
    },
    likes: p.likes,
    _count: { comments: p._count.comments },
  }))

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
