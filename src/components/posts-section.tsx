'use client'

import { getAllContentPosts as getAllMoviePosts } from '@/app/(user)/post/actions'
import PostList from '@/components/post-list'
import type { GenericPost } from '../../types/post'
import { useCallback, useEffect, useState } from 'react'




interface PostsSectionProps {
  readonly movieId: string
  readonly refreshTrigger?: number
}

export function PostsSection({ movieId, refreshTrigger }: PostsSectionProps) {
  const [posts, setPosts] = useState<GenericPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedPosts = await getAllMoviePosts(movieId)
      // Prefer cached posterPath from DB; fall back to API route if missing
      const withPosters: GenericPost[] = await Promise.all(
        fetchedPosts.map(async (post) => {
          const posterPath = post.movie?.posterPath ?? null
          let posterUrl: string | null = null

          if (posterPath) {
            posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`
          } else {
            try {
              const typeParam = post.movie?.type === 'tv_series' ? 'tv' : 'movie'
              const contentId = post.movie?.id ?? movieId
              const res = await fetch(`/api/poster?id=${contentId}&type=${typeParam}`, { cache: 'no-store' })
              const data = await res.json()
              posterUrl = data?.posterUrl || '/logo.png'
            } catch {
              posterUrl = '/logo.png'
            }
          }

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
              image: post.user?.image ?? null
            },
            movie: post.movie ? {
              id: post.movie.id,
              type: post.movie.type,
              posterPath: post.movie.posterPath
            } : undefined,
            likes: post.likes,
            dislikes: post.dislikes,
            _count: { comments: post._count.comments },
          }
        })
      )
      setPosts(withPosters)
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
    return <PostList posts={[]} emptyText="Loading posts..." />
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

  return <PostList posts={posts} emptyText="Be the first to share your thoughts about this movie!" />
}
