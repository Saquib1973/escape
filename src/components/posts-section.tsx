'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllMoviePosts } from '@/app/(user)/(cinema)/movie/actions'
import PostList from '@/components/post-list'

type RatingEnum = 'TRASH' | 'TIMEPASS' | 'ONE_TIME_WATCH' | 'MUST_WATCH' | 'LEGENDARY'

interface Post {
  id: string
  title: string | null
  content: string
  rating: RatingEnum | null
  isSpoiler: boolean
  createdAt: Date
  user: {
    id: string
    name: string | null
    image: string | null
  }
  likes: Array<{ id: string; userId: string }>
  _count: {
    comments: number
  }
}

interface PostsSectionProps {
  readonly movieId: string
  readonly refreshTrigger?: number
}

export function PostsSection({ movieId, refreshTrigger }: PostsSectionProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedPosts = await getAllMoviePosts(movieId)
      setPosts(fetchedPosts)
    } catch (err) {
      setError('Failed to load posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }, [movieId])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Refetch posts when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchPosts()
    }
  }, [refreshTrigger, fetchPosts])

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-dark-gray-2 p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-dark-gray"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-dark-gray w-24"></div>
                    <div className="h-3 bg-dark-gray w-16"></div>
                    <div className="h-4 bg-dark-gray w-3/4"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-dark-gray w-full"></div>
                      <div className="h-3 bg-dark-gray w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-center text-red-400 text-xl">Error</p>
          <p className="text-red-400 mb-4">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="flex justify-end items-center mb-6">
        {Boolean(posts?.length) && (
          <span className="text-gray-400 text-sm">{posts.length} posts</span>
        )}
      </div>

      <PostList posts={posts} emptyText="Be the first to share your thoughts about this movie!" />
    </div>
  )
}
