'use server'

import { prisma, authOptions } from '@/lib'
import { getServerSession } from 'next-auth'
// Generic post mapping is now handled at call sites; no poster augmentation here

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
          select: { id: true, type: true, posterPath: true }
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
        movie: {
          select: { id: true, type: true, posterPath: true }
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


