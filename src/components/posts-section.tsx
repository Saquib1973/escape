'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllMoviePosts } from '@/app/(user)/(cinema)/movie/actions'
import { Star, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
  id: string
  title: string | null
  content: string
  rating: number | null
  isSpoiler: boolean
  createdAt: Date
  user: {
    id: string
    name: string | null
    image: string | null
  }
  likes: Array<{ id: string; userId: string }>
  dislikes: Array<{ id: string; userId: string }>
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating / 2)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-400'
        }`}
      />
    ))
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-300 mb-4">
            <h3 className="font-semibold mb-2">No posts yet</h3>
            <p className="text-sm">
              Be the first to share your thoughts about this movie!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id} className="bg-dark-gray-2 p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-dark-gray flex items-center justify-center overflow-hidden">
                    {post.user.image ? (
                      <Image
                        src={post.user.image}
                        alt={post.user.name || 'User'}
                        width={48}
                        height={48}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-semibold">
                        {post.user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 mb-2">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {post.user.name || 'Anonymous'}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {post.rating && (
                        <div className="flex items-center gap-1">
                          {renderStars(post.rating)}
                          <span className="text-gray-400 text-sm ml-1">
                            {post.rating}/10
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {post.title && (
                    <h3 className="text-xl font-medium text-white mb-2">
                      {post.title}
                    </h3>
                  )}

                  {post.isSpoiler && (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 mb-3">
                      <p className="text-yellow-400 text-sm font-medium">
                        ⚠️ This post contains spoilers
                      </p>
                    </div>
                  )}

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{post.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">{post.dislikes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post._count.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
