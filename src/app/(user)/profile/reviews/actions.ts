import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { GenericPost } from '@/components/post-list'
import { getMoviePosterInfo, getTVSeriesPosterInfo } from '@/lib/tmdb'

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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Fetch posters in parallel per post
    const results: GenericPost[] = await Promise.all(
      posts.map(async (post) => {
        let posterUrl: string | null = null
        try {
          const posterInfo = post.movie.type === 'tv_series'
            ? await getTVSeriesPosterInfo(post.movie.id)
            : await getMoviePosterInfo(post.movie.id)
          posterUrl = posterInfo?.posterUrl ?? null
        } catch {}

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
    )

    return results
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }
}
