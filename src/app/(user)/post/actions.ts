'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMultipleMoviePosterInfo, getMultipleTVSeriesPosterInfo } from '@/lib/tmdb'
import type { GenericPost } from '@/components/post-list'
import type { TMDBMoviePoster, TMDBTVSeriesPoster } from '@/types/tmdb'

export type RatingEnum =
  | 'TRASH'
  | 'TIMEPASS'
  | 'ONE_TIME_WATCH'
  | 'MUST_WATCH'
  | 'LEGENDARY'

export interface CreatePostData {
  title?: string | null
  content: string
  rating?: RatingEnum | null
  isSpoiler: boolean
  contentId: string
}

// Feed: fetch latest posts across all content types
export async function getAllFeedPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: { id: true, name: true, image: true }
        },
        movie: {
          select: { id: true, type: true }
        },
        likes: { select: { id: true, userId: true } },
        dislikes: { select: { id: true, userId: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return posts
  } catch (error) {
    console.error('Error fetching feed posts:', error)
    return []
  }
}

// Content page: fetch all posts for a specific content id
export async function getAllContentPosts(contentId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { contentId },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        },
        likes: { select: { id: true, userId: true } },
        dislikes: { select: { id: true, userId: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return posts
  } catch (error) {
    console.error('Error fetching content posts:', error)
    return []
  }
}


// Create post (works for movie or tv series based on existing Movie row.type)
export async function createPost(data: CreatePostData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error('You must be logged in to create a post')
    }

    if (!data.content?.trim()) {
      throw new Error('Post content is required')
    }
    if (!data.contentId) {
      throw new Error('Content ID is required')
    }

    const validRatings: RatingEnum[] = ['TRASH','TIMEPASS','ONE_TIME_WATCH','MUST_WATCH','LEGENDARY']
    if (data.rating && !validRatings.includes(data.rating)) {
      throw new Error('Invalid rating value')
    }

    // Ensure referenced content exists; if not, create as generic movie row.
    // The specific type (movie/tv_series) can be set by detail pages when first visited.
    await prisma.movie.upsert({
      where: { id: data.contentId },
      update: {},
      create: { id: data.contentId, type: 'movie' }
    })

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content.trim(),
        rating: data.rating,
        isSpoiler: data.isSpoiler,
        contentId: data.contentId,
        userId: session.user.id
      },
      include: {
        user: { select: { id: true, name: true, image: true } }
      }
    })

    return post
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

// Shared function to fetch posts with poster information
export async function getPostsWithPosters(posts: Array<{
  id: string
  title: string | null
  content: string
  rating: RatingEnum | null
  isSpoiler: boolean
  createdAt: Date
  movie: { id: string; type: string }
  user: { name: string | null; image: string | null }
  likes: Array<{ id: string; userId: string }>
  dislikes?: Array<{ id: string; userId: string }>
  _count: { comments: number }
}>): Promise<GenericPost[]> {
  if (posts.length === 0) return []

  const moviePosts = posts.filter((post) => post.movie.type === 'movie')
  const tvSeriesPosts = posts.filter((post) => post.movie.type === 'tv_series')

  const movieIds = moviePosts.map((post) => post.movie.id)
  const tvSeriesIds = tvSeriesPosts.map((post) => post.movie.id)

  const [moviePosterMap, tvSeriesPosterMap] = await Promise.all([
    movieIds.length > 0 ? getMultipleMoviePosterInfo(movieIds) : Promise.resolve(new Map()),
    tvSeriesIds.length > 0 ? getMultipleTVSeriesPosterInfo(tvSeriesIds) : Promise.resolve(new Map()),
  ])

  return posts.map((post) => {
    let contentInfo: TMDBMoviePoster | TMDBTVSeriesPoster | undefined
    if (post.movie.type === 'movie') {
      contentInfo = moviePosterMap.get(post.movie.id)
    } else {
      contentInfo = tvSeriesPosterMap.get(post.movie.id)
    }

    return {
      id: post.id,
      title: post.title ?? null,
      content: post.content,
      rating: post.rating,
      isSpoiler: post.isSpoiler,
      createdAt: post.createdAt,
      posterUrl: contentInfo?.posterUrl ?? '/logo.png',
      user: {
        name: post.user.name,
        image: post.user.image,
      },
      likes: post.likes,
      dislikes: post.dislikes,
      _count: { comments: post._count.comments },
    }
  })
}


