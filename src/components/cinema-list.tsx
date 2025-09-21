'use client'

import { MoveRight, Option, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MediaItem } from '../types/media'
import CinemaListLoadingSkeleton from './skeletons/cinema-list-loading-skeleton'
import { cn } from '@/lib'
import { useQuery } from '@tanstack/react-query'
import Header from './header'
import MediaItemDropdown from './media-item-dropdown'
interface CinemaListProps {
  title: string
  subHeading?: string
  items?: MediaItem[]
  apiUrl?: string
  linkPath?: (id: number) => string
  scrollContainerClass?: string
  showMoreLink?: string
  getYear?: (item: MediaItem) => number
  getTitle?: (item: MediaItem) => string
  showRating?: boolean
  showEmptyState?: boolean
  className?: string
  contentType?: 'movie' | 'tv_series'
  showDropdown?: boolean
  onWatchlistToggle?: (item: MediaItem) => void
  getWatchlistStatus?: (item: MediaItem) => boolean
}

const CinemaList: React.FC<CinemaListProps> = ({
  title,
  subHeading,
  items: itemsProp,
  apiUrl,
  linkPath,
  scrollContainerClass = 'cinema-scroll-container',
  showMoreLink,
  getYear,
  getTitle,
  showRating = true,
  showEmptyState = false,
  className,
  contentType = 'movie',
  showDropdown = false,
  onWatchlistToggle,
  getWatchlistStatus,
}) => {
  const shouldFetch = (!itemsProp || itemsProp.length === 0) && Boolean(apiUrl)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<{
    results?: MediaItem[]
  }>({
    queryKey: ['cinema-list', apiUrl],
    queryFn: async () => {
      if (!apiUrl) return { results: [] }
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error('Failed to load data')
      }
      return response.json()
    },
    enabled: shouldFetch,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
  })

  const fetchedItems = useMemo(() => data?.results ?? [], [data])
  const items: MediaItem[] = useMemo(() => {
    return itemsProp && itemsProp.length > 0 ? itemsProp : fetchedItems
  }, [itemsProp, fetchedItems])

  // Default helper functions
  const defaultGetYear = useCallback((item: MediaItem) => {
    return new Date(item.release_date as string).getFullYear()
  }, [])

  const defaultGetTitle = useCallback((item: MediaItem) => {
    return item.title as string
  }, [])

  const defaultLinkPath = useCallback((id: number) => {
    return `/movie/${id}`
  }, [])

  // Use provided functions or defaults
  const finalGetYear = getYear || defaultGetYear
  const finalGetTitle = getTitle || defaultGetTitle
  const finalLinkPath = linkPath || defaultLinkPath

  // fetching is handled by useQuery

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: 10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.querySelector(`.${scrollContainerClass}`)
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const renderHeader = () => (
    <div className={`flex justify-between items-center`}>
      <Header className="mb-0" title={title} subHeading={subHeading} />
      <div className="flex gap-2 h-fit">
        <button
          onClick={() => handleScroll('left')}
          className="p-2 bg-dark-gray hover:bg-dark-gray-hover transition-colors"
          aria-label="Scroll left"
        >
          <svg
            className="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="p-2 bg-dark-gray hover:bg-dark-gray-hover transition-colors"
          aria-label="Scroll right"
        >
          <svg
            className="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  )

  const renderContent = () => {
    if (isLoading) {
      return <CinemaListLoadingSkeleton itemCount={8} />
    }
    if (isError) {
      return (
        <div className="w-full h-72 flex flex-col items-center justify-center gap-3">
          <div className="text-red-400">
            {error instanceof Error ? error.message : 'Failed to load data'}
          </div>
          <button
            onClick={() => {
              if (!isFetching) {
                void refetch()
              }
            }}
            disabled={isFetching}
            className={`px-4 py-2 bg-dark-gray hover:bg-dark-gray-hover text-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors`}
          >
            {isFetching ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )
    }
    if (showEmptyState && items.length === 0) {
      return (
        <div className="w-full h-72 flex items-center justify-center">
          <div className="text-gray-400">No recommendations available</div>
        </div>
      )
    }

    return (
      <>
        <div className="w-full h-fit">
          <motion.div
            className={`${scrollContainerClass} flex gap-2 h-full overflow-x-auto scrollbar-hide`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <div className="flex-shrink-0 group w-36 block h-full relative">
                  <div className="bg-dark-gray-2 overflow-hidden h-full">
                    <div className="flex flex-col w-full h-full">
                      <div className="h-full flex items-center justify-center overflow-hidden relative">
                        <Link
                          href={finalLinkPath(item.id)}
                          className="block w-full h-full"
                        >
                          {item.poster_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                              alt={finalGetTitle(item)}
                              width={160}
                              height={240}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <div className="w-16 h-40 mb-2 mx-auto bg-gray-700"></div>
                              <p className="text-sm font-medium">No Image</p>
                            </div>
                          )}
                        </Link>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                          <div className='absolute top-0 right-0'>
                            <MediaItemDropdown
                              item={{
                                id: item.id,
                                title: finalGetTitle(item),
                                poster_path: item.poster_path,
                                release_date: item.release_date,
                              }}
                              contentType={contentType}
                              onWatchlistToggle={() =>
                                onWatchlistToggle?.(item)
                              }
                              isInWatchlist={
                                getWatchlistStatus?.(item) || false
                              }
                            />
                          </div>
                        )}
                      </div>

                      {showRating && (
                        <div className="flex items-center p-2 justify-between text-xs text-gray-500">
                          <span>{finalGetYear(item)}</span>
                          <span className="flex items-center gap-1">
                            <Star className="size-3 fill-light-green text-light-green" />
                            {item.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {showMoreLink && (
          <div className="flex justify-end">
            <Link
              href={showMoreLink}
              className="text-gray-300 hover:text-white text-sm transition-all flex gap-1 items-center justify-center"
            >
              See more
              <MoveRight className="size-5" />
            </Link>
          </div>
        )}
      </>
    )
  }

  return (
    <div className={cn('w-full max-w-6xl flex flex-col gap-4 mb-6', className)}>
      {renderHeader()}
      {renderContent()}
    </div>
  )
}

export default CinemaList
