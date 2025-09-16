'use client'
import { TrendingItem } from '@/types/trending'
import { Calendar, ChevronDown, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import Loader from '../../loader'
import { motion, type Variants } from 'framer-motion'
import { http } from '@/lib'

// Skeleton component for loading state
const TrendingSkeleton = () => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: 10 }).map((_, index) => (
      <div key={index + 'skeleton'} className="animate-pulse">
        <div className="flex bg-dark-gray-2">
          {/* Poster Skeleton */}
          <div className="relative max-md:h-60 w-40 aspect-square md:h-52 flex-shrink-0">
            <div className="absolute inset-0 bg-dark-gray-hover" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex max-md:flex-col md:items-center gap-4">
                <div className="w-8 h-8 bg-dark-gray rounded"></div>
                <div className="h-6 w-48 bg-dark-gray rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-dark-gray rounded"></div>
                <div className="h-4 w-8 bg-dark-gray rounded"></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="h-4 bg-dark-gray rounded w-full"></div>
              <div className="h-4 bg-dark-gray rounded w-4/5"></div>
              <div className="h-4 bg-dark-gray rounded w-3/5"></div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-dark-gray rounded"></div>
                <div className="h-4 w-12 bg-dark-gray rounded"></div>
              </div>
              <div className="h-4 w-16 bg-dark-gray rounded"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const TrendingListComponent = () => {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showSkeleton, setShowSkeleton] = useState(true)

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 120, damping: 16 },
    },
  }

  //effects
  useEffect(() => {
    fetchTrendingItems(1, true)
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchTrendingItems(currentPage + 1, false)
    }
  }, [loadingMore, hasMore, currentPage])

  // function to fetch trending data
  const fetchTrendingItems = async (
    page: number,
    isInitial: boolean = false
  ) => {
    try {
      if (isInitial) {
        setLoading(true)
        setShowSkeleton(true)
        setError(null)
      } else {
        setLoadingMore(true)
      }

      const url = `/api/trending-all?page=${page}&time_window=day`
      const response = await http.getWithRetry(url, {}, {
        maxRetries: 3,
        baseDelayMs: 300,
        timeoutMs: 8000,
      })

      const data = response.data as { results: TrendingItem[]; total_pages: number }

      if (isInitial) {
        setTrendingItems(data.results || [])
        // Hide skeleton after a short delay to show the transition
        setTimeout(() => {
          setShowSkeleton(false)
        }, 500)
      } else {
        setTrendingItems((prev) => [...prev, ...(data.results || [])])
      }

      setHasMore(page < data.total_pages)
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching trending items:', err)
      if (isInitial) {
        setError('Failed to load trending items')
        setShowSkeleton(false)
      }
    } finally {
      if (isInitial) {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
  }

  const getTitle = (item: TrendingItem) => item.title || item.name || 'Unknown'
  const getReleaseYear = (item: TrendingItem) => {
    const date = item.release_date || item.first_air_date
    return date ? new Date(date).getFullYear() : 'N/A'
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-red-400 text-center">
          <h2 className="text-xl mb-2">Error Loading Trending Content</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Show skeleton for initial loading */}
      {showSkeleton && loading ? (
        <TrendingSkeleton />
      ) : (
        <>
          {/* Trending List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4 md:gap-2"
          >
            {trendingItems.map((item, index) => (
              <motion.div key={item.id + index} variants={itemVariants}>
                <Link
                  href={
                    item.media_type === 'movie'
                      ? `/movie/${item.id}`
                      : `/web-series/${item.id}`
                  }
                  className="group w-full transition-all duration-300 cursor-pointer"
                >
                  <div className="flex hover:bg-dark-gray-hover bg-dark-gray-2">
                    {/* Poster Image */}
                    <div className="relative max-md:h-60 w-40 aspect-square md:h-52 flex-shrink-0">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={getTitle(item)}
                          fill
                          className="object-center"
                        />
                      ) : (
                        <div className="w-full h-full bg-dark-gray flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <div className="w-16 h-24 mb-2 mx-auto bg-dark-gray-2 rounded"></div>
                            <p className="text-sm">No Image</p>
                          </div>
                        </div>
                      )}

                      {/* Media Type Badge */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium ${
                            item.media_type === 'movie'
                              ? 'bg-light-green text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {item.media_type === 'movie' ? 'Movie' : 'TV'}
                        </span>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex max-md:flex-col md:items-center gap-4">
                          <span className="text-4xl font-extrabold text-dark-gray-hover group-hover:text-light-green transition-colors">
                            #{index + 1}
                          </span>
                          <h3 className="text-xl text-gray-300 font-medium group-hover:text-white transition-colors">
                            {getTitle(item)}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 fill-light-green text-light-green" />
                          <span className="text-gray-300 font-medium">
                            {item.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {item.overview || 'No description available'}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{getReleaseYear(item)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{item.media_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 flex items-center justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`px-4 py-2 text-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loadingMore ? (
                  <Loader />
                ) : (
                  <div className="flex gap-1 items-center cursor-pointer">
                    Load more
                    <ChevronDown className="size-5" />
                  </div>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TrendingListComponent
