import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getPosterUrl } from '@/lib/tmdb'
import type { GenericPost } from '@/types/post'

export async function getUserReviews(): Promise<GenericPost[]> {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return []
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        rating: true,
        isSpoiler: true,
        createdAt: true,
        contentId: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        likes: { select: { id: true, userId: true } },
        _count: { select: { comments: true } },
        movie: {
          select: {
            id: true,
            type: true,
            posterPath: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const results: GenericPost[] = posts.map((post) => {
      const posterUrl = getPosterUrl(post.movie?.posterPath ?? null, 'w500')
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        rating: post.rating,
        isSpoiler: post.isSpoiler,
        createdAt: post.createdAt,
        posterUrl,
        user: {
          name: post.user?.name ?? null,
          image: post.user?.image ?? null,
        },
        likes: post.likes,
        _count: { comments: post._count.comments },
      }
    })

    return results
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }
}
