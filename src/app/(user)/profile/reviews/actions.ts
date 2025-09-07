import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { SimplerPost } from '@/types/post'

export async function getUserReviews(): Promise<SimplerPost[]> {
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
        movie: {
          select: {
            id: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      rating: post.rating,
      isSpoiler: post.isSpoiler,
      createdAt: post.createdAt,
      contentId: post.contentId,
      movieType: post.movie.type,
    }))
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }
}
