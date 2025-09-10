'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllFeedPosts } from '@/app/(user)/(cinema)/movie/actions'
import {
  getMultipleMoviePosterInfo,
  getMultipleTVSeriesPosterInfo,
} from '@/lib/tmdb'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
type RatingEnum = 'TRASH' | 'TIMEPASS' | 'ONE_TIME_WATCH' | 'MUST_WATCH' | 'LEGENDARY'

interface MovieReview {
  id: string
  movieTitle: string
  year: string | null
  rating: RatingEnum | null
  commentCount: number
  likeCount: number
  reviewer: {
    username: string | null
    avatar: string | null
  }
  reviewText: string
  moviePoster: string | null
  movieId: string
  contentType: 'movie' | 'tv_series'
}

const FeedComponent = () => {
  const [reviews, setReviews] = useState<MovieReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch posts from database
        const posts = await getAllFeedPosts()

        if (posts.length === 0) {
          setReviews([])
          setLoading(false)
          return
        }

        // Separate movies and TV series
        const moviePosts = posts.filter((post) => post.movie.type === 'movie')
        const tvSeriesPosts = posts.filter(
          (post) => post.movie.type === 'tv_series'
        )

        // Get unique content IDs for each type
        const movieIds = [...new Set(moviePosts.map((post) => post.movie.id))]
        const tvSeriesIds = [
          ...new Set(tvSeriesPosts.map((post) => post.movie.id)),
        ]

        // Fetch poster info from TMDB for both types
        const [moviePosterMap, tvSeriesPosterMap] = await Promise.all([
          movieIds.length > 0
            ? getMultipleMoviePosterInfo(movieIds)
            : Promise.resolve(new Map()),
          tvSeriesIds.length > 0
            ? getMultipleTVSeriesPosterInfo(tvSeriesIds)
            : Promise.resolve(new Map()),
        ])

        // Transform posts to reviews format
        const transformedReviews: MovieReview[] = posts.map((post) => {
          let contentInfo
          let contentType: 'movie' | 'tv_series'

          if (post.movie.type === 'movie') {
            contentInfo = moviePosterMap.get(post.movie.id)
            contentType = 'movie'
          } else {
            contentInfo = tvSeriesPosterMap.get(post.movie.id)
            contentType = 'tv_series'
          }

          return {
            id: post.id,
            movieTitle:
              contentInfo?.title ||
              (contentType === 'movie' ? 'Unknown Movie' : 'Unknown TV Series'),
            year: contentInfo?.releaseYear || null,
            rating: post.rating,
            commentCount: post._count.comments,
            likeCount: post.likes.length,
            reviewer: {
              username: post.user.name,
              avatar: post.user.image,
            },
            reviewText: post.content,
            moviePoster: contentInfo?.posterUrl || null,
            movieId: post.movie.id,
            contentType,
          }
        })

        setReviews(transformedReviews)
      } catch (err) {
        console.error('Error fetching feed data:', err)
        setError('Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchFeedData()
  }, [])

  const ratingBadge = (rating: RatingEnum) => {
    const map: Record<RatingEnum, { label: string; className: string }> = {
      TRASH: { label: 'Trash', className: 'bg-red-900/30 text-red-300 border-red-500/30' },
      TIMEPASS: { label: 'Timepass', className: 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30' },
      ONE_TIME_WATCH: { label: 'One-time watch', className: 'bg-blue-900/20 text-blue-300 border-blue-500/30' },
      MUST_WATCH: { label: 'Must watch', className: 'bg-green-900/20 text-green-300 border-green-500/30' },
      LEGENDARY: { label: 'Legendary', className: 'bg-purple-900/20 text-purple-300 border-purple-500/30' },
    }
    const cfg = map[rating]
    return (
      <span className={`text-xs px-2 py-0.5 border ${cfg.className}`}>
        {cfg.label}
      </span>
    )
  }

  function renderContent() {
    if (loading) {
      return (
        <div className="flex flex-col gap-3 py-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`loading-skeleton-${i}`}
              className="p-6 px-4 animate-pulse"
            >
              <div className="flex gap-4">
                {/* Movie Poster Skeleton */}
                <div className="flex-shrink-0">
                  <div className="w-36 h-48 bg-dark-gray"></div>
                </div>

                {/* Review Content Skeleton */}
                <div className="flex flex-col min-w-0 w-full">
                  {/* Reviewer Info Skeleton */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-8 h-8 bg-dark-gray rounded-full"></div>
                    <div className="h-4 bg-dark-gray w-20"></div>
                  </div>

                  {/* Movie Title and Year Skeleton */}
                  <div className="mb-1">
                    <div className="h-6 bg-dark-gray w-48 mb-1"></div>
                    <div className="h-4 bg-dark-gray w-12"></div>
                  </div>

                  {/* Rating and Comments Skeleton */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, j) => (
                        <div key={j} className="w-4 h-4 bg-dark-gray"></div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-dark-gray"></div>
                      <div className="h-4 bg-dark-gray w-6"></div>
                    </div>
                  </div>

                  {/* Review Text Skeleton */}
                  <div className="mb-4">
                    <div className="h-3 bg-dark-gray w-full mb-1"></div>
                    <div className="h-3 bg-dark-gray w-5/6 mb-1"></div>
                    <div className="h-3 bg-dark-gray w-4/5"></div>
                  </div>

                  {/* Like Button and Count Skeleton */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-dark-gray"></div>
                      <div className="h-4 bg-dark-gray w-20"></div>
                    </div>
                    <div className="h-4 bg-dark-gray w-12"></div>
                  </div>
                </div>
              </div>
              {/* Separator Line Skeleton */}
              <div className="mt-6 w-[80%] mx-auto h-0.5 bg-dark-gray"></div>
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="py-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )
    }

    if (reviews.length === 0) {
      return (
        <div className="py-6 text-center">
          <p className="text-gray-400">
            No reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3 py-6">
        <AnimatePresence mode="wait">
            {reviews.map((review, index) => {
              return (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: (index + 1) * 0.1,
                  },
                }}
                onClick={() => {
                  router.push(`/post/${review.id}`)
                }}
                key={review.id}
                className="cursor-pointer transition-colors p-6 px-0"
              >
                <div className="flex gap-4">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0">
                    <div className="w-36 h-48 bg-dark-gray flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                      <Image
                        src={
                          review.moviePoster ||
                          (review.contentType === 'movie'
                            ? '/placeholder-movie.jpg'
                            : '/placeholder-tv.jpg')
                        }
                        alt={review.movieTitle}
                        width={160}
                        height={208}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src =
                            review.contentType === 'movie'
                              ? '/placeholder-movie.jpg'
                              : '/placeholder-tv.jpg'
                        }}
                      />
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex flex-col min-w-0">
                    {/* Reviewer Info */}
                    <div className="flex items-center gap-1 mb-2">
                      {review.reviewer.avatar ? (
                        <Image
                          src={review.reviewer.avatar}
                          alt={review.reviewer.username || 'User'}
                          width={32}
                          height={32}
                          unoptimized={review.reviewer.avatar.includes(
                            'dicebear'
                          )}
                          className="w-8 h-8 bg-light-green rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">
                          {review.reviewer.username
                            ?.charAt(0)
                            .toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="text-gray-300 text-sm">
                        {review.reviewer.username || 'Anonymous'}
                      </span>
                    </div>

                    {/* Movie Title and Year */}
                    <div className="mb-1 text-start">
                      <h3 className="text-xl font-bold text-white">
                        {review.movieTitle}
                      </h3>
                      {review.year && (
                        <span className="text-gray-400 text-sm">
                          {review.year}
                        </span>
                      )}
                    </div>

                    {/* Rating and Comments */}
                    <div className="flex items-center gap-3 mb-1">
                      {review.rating && ratingBadge(review.rating)}
                      <div className="flex items-center gap-1 text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {review.commentCount}
                        </span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {review.reviewText}
                    </p>

                    {/* Like Button */}
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">Like review</span>
                      </button>
                      <span className="text-gray-400 text-sm">
                        {review.likeCount} likes
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 w-[80%] mx-auto h-0.5 bg-dark-gray-2/30" />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-md:px-4">
        <h1 className="text-2xl text-gray-300">Reviews</h1>
        {renderContent()}
      </div>
      <div className="flex justify-self-end pt-2 px-3">
        <Link
          href="/feed"
          className="text-gray-300 hover:text-white text-sm transition-all flex gap-1 items-center justify-center"
        >
          Show More
          <ChevronDown />
        </Link>
      </div>
    </div>
  )
}

export default FeedComponent
