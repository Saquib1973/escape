'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, Heart, MessageCircle, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllFeedPosts } from '@/app/(user)/movie/actions'
import {
  getMultipleMoviePosterInfo,
  getMultipleTVSeriesPosterInfo,
} from '@/lib/tmdb'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
interface MovieReview {
  id: string
  movieTitle: string
  year: string | null
  rating: number | null
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

  const renderStars = (rating: number | null) => {
    if (!rating) return null

    // Convert 1-10 rating to 1-5 stars
    const starRating = Math.floor(rating / 2)

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < starRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 md:px-0">
        <div className="w-full">
          <h1 className="pl-4 text-2xl text-gray-300">Reviews</h1>
          <div className="flex flex-col gap-3 py-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={`loading-skeleton-${i}`}
                className="bg-dark-gray-2 p-6 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-40 h-44 bg-light-gray"></div>
                  <div className="flex flex-col w-full gap-1">
                    <div className="h-4 bg-light-gray w-1/4"></div>
                    <div className="h-6 bg-light-gray w-1/2"></div>
                    <div className="h-4 bg-light-gray w-1/3"></div>
                    <div className="flex flex-col gap-1">
                      <div className="h-3 bg-light-gray"></div>
                      <div className="h-3 bg-light-gray w-5/6"></div>
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
      <div className="flex flex-col items-center justify-center p-4 md:px-0">
        <div className="w-full">
          <h1 className="pl-4 text-2xl text-gray-300">Reviews</h1>
          <div className="py-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:px-0">
      <div className="w-full">
        <h1 className="pl-4 text-2xl text-gray-300">Reviews</h1>

        {reviews.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-gray-400">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-6">
            <AnimatePresence mode="wait">
              {reviews.map((review, index) => (
                <motion.div
                  initial={{ opacity:0 , y: -5 }}
                  animate={{
                    opacity:1,
                    y: 0,
                    transition: {
                      delay: (index + 1) * 0.1,
                    },
                  }}
                  onClick={() => {
                    router.push(`/post/${review.movieId}`)
                  }}
                  key={review.id}
                  className="bg-dark-gray-2 p-6"
                >
                  <div className="flex gap-4">
                    {/* Movie Poster */}
                    <div className="flex-shrink-0">
                      <div className="w-40 h-52 bg-light-gray flex items-center justify-center text-gray-400 text-xs overflow-hidden">
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
                      <div className="flex items-center gap-2 mb-2">
                        {review.reviewer.avatar ? (
                          <Image
                            src={review.reviewer.avatar}
                            alt={review.reviewer.username || 'User'}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
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
                      <div className="mb-2 text-start">
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
                      <div className="flex items-center gap-4 mb-3">
                        {review.rating && (
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-gray-400">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{review.commentCount}</span>
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
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
