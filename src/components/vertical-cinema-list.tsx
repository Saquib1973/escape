'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib'
import { MediaItem } from '../types/media'
import Header from './header'
import { useQuery } from '@tanstack/react-query'
import MediaItemDropdown from './media-item-dropdown'

interface VerticalCinemaListProps {
  title: string
  subHeading?:string
  items?: MediaItem[]
  apiUrl?: string
  showEmptyState?: boolean
  className?: string
  contentType?: 'movie' | 'tv_series'
  showDropdown?: boolean
  onWatchlistToggle?: (item: MediaItem) => void
  getWatchlistStatus?: (item: MediaItem) => boolean
}

const VerticalCinemaList: React.FC<VerticalCinemaListProps> = ({
  title,
  subHeading,
  items: itemsProp,
  apiUrl,
  showEmptyState = false,
  className,
  contentType = 'movie',
  showDropdown = false,
  onWatchlistToggle,
  getWatchlistStatus,
}) => {
  const shouldFetch = (!itemsProp || itemsProp.length === 0) && Boolean(apiUrl)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<{ results?: MediaItem[] }>({
    queryKey: ['vertical-cinema-list', apiUrl],
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
  const getTitle = useCallback((item: MediaItem) => {
    return item.title as string
  }, [])

  const linkPath = useCallback((id: number) => {
    return `/movie/${id}`
  }, [])

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
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const skeletonKeys = useMemo(() => Array.from({ length: 12 }, () => Math.random().toString(36).slice(2)), [])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex w-full flex-wrap gap-1 items-center justify-start py-2">
          {skeletonKeys.map((key) => (
            <div key={key} className="flex-shrink-0">
              <div className="relative aspect-[2/3] w-[108px] bg-dark-gray-2 overflow-hidden rounded-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-dark-gray via-dark-gray-2 to-dark-gray animate-pulse" />

                <div className="absolute top-1 right-1 bg-black/40 px-1 py-0.5 flex items-center gap-1 text-xs text-white rounded">
                  <div className="size-2 bg-dark-gray-hover rounded-full animate-pulse" />
                  <div className="w-3 h-2 bg-dark-gray-hover animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
    if (isError) {
      return (
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="text-red-400 text-center">
            <div className="text-lg mb-2">⚠️</div>
            <div className="text-sm">{(error instanceof Error ? error.message : 'Failed to load data')}</div>
          </div>
          <button
            onClick={() => { if (!isFetching) { void refetch() } }}
            disabled={isFetching}
            className="px-6 py-2 bg-light-green hover:bg-light-green/80 text-black font-medium rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isFetching ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      )
    }
    if (showEmptyState && items.length === 0) {
      return (
        <div className="w-full flex flex-col items-center justify-center gap-3">
          <div className="text-4xl">🎬</div>
          <div className="text-gray-400 text-center">
            <div className="text-sm font-medium">No upcoming movies</div>
            <div className="text-xs mt-1">
              Check back later for new releases
            </div>
          </div>
        </div>
      )
    }

    return (
      <motion.div
        className="flex w-full flex-wrap gap-1 items-center justify-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="flex-shrink-0"
          >
            <div className="flex flex-col items-center group cursor-pointer relative">
              <Link
                href={linkPath(item.id)}
                className="block"
              >
                <div className="relative aspect-[2/3] w-[108px] bg-dark-gray-2 overflow-hidden">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={getTitle(item)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs bg-dark-gray-2">
                    <div className="text-xl mb-1">🎬</div>
                    <div className="text-center text-xs">No Image</div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-dark-gray/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rating badge */}
                <div className="absolute top-1 right-1 bg-black/70 px-1 py-0.5 flex items-center gap-1 text-xs text-white">
                  <Star className="size-2 fill-light-green text-light-green" />
                  <span className="font-medium">
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
                </div>
              </Link>

              {showDropdown && (
                <div className="absolute top-1 right-1">
                  <MediaItemDropdown
                    item={{
                      id: item.id,
                      title: getTitle(item),
                      poster_path: item.poster_path,
                      release_date: item.release_date,
                    }}
                    contentType={contentType}
                    onWatchlistToggle={() => onWatchlistToggle?.(item)}
                    isInWatchlist={getWatchlistStatus?.(item) || false}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <Header title={title} subHeading={subHeading} />
      <div className="overflow-y-auto w-full scrollbar-hide">
        {renderContent()}
      </div>
    </div>
  )
}

export default VerticalCinemaList
