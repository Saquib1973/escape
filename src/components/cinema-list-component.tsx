'use client'

import { MoveRight, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MediaItem } from '../types/media'
import CinemaListLoadingSkeleton from './skeletons/cinema-list-loading-skeleton'

interface CinemaListComponentProps {
  title: string
  apiUrl: string
  linkPath: (id: number) => string
  scrollContainerClass: string
  showMoreLink?: string
  getYear: (item: MediaItem) => number
  getTitle: (item: MediaItem) => string
  showRating?: boolean
  showEmptyState?: boolean
}

const CinemaListComponent: React.FC<CinemaListComponentProps> = ({
  title,
  apiUrl,
  linkPath,
  scrollContainerClass,
  showMoreLink,
  getYear,
  getTitle,
  showRating = true,
  showEmptyState = false,
}) => {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWUyYjQxN2E1YTBlMmVjODMxMWI5MmI2MDFlNTc0NyIsIm5iZiI6MTc1NTIwOTI1Mi42MDYwMDAyLCJzdWIiOiI2ODllNWUyNGEyOTE4ZDdkZWM4ZGJmMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6j_ocxIEWOsbgjBG_eYv80kApJeZvlX2aEOCK2Roctk'
          }
        }

        const response = await fetch(apiUrl, options)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const data = await response.json()
        setItems(data.results || [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiUrl])

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.querySelector(`.${scrollContainerClass}`)
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const renderHeader = () => (
    <div className={`flex justify-between items-center}`}>
      <h1 className={`text-2xl text-gray-300`}>{title}</h1>
      <div className="flex gap-2">
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
    if (loading) {
      return <CinemaListLoadingSkeleton itemCount={8} />
    }

    if (error) {
      return (
        <div className="w-full h-72 flex items-center justify-center">
          <div className="text-red-400">{error}</div>
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
        {/* Items Grid */}
        <div className="w-full h-fit">
          <div className={`${scrollContainerClass} flex gap-3 overflow-x-auto pb-2 scrollbar-hide`}>
            {items.map((item) => (
              <Link
                href={linkPath(item.id)}
                key={item.id}
                className="flex-shrink-0 w-36"
              >
                <div className="bg-dark-gray-2 overflow-hidden h-full">
                  <div className="flex flex-col w-full h-full">
                    <div className="h-full flex items-center justify-center">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={getTitle(item)}
                          width={160}
                          height={240}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <div className="w-16 h-40 mb-2 mx-auto bg-gray-700"></div>
                          <p className="text-sm font-medium">No Image</p>
                        </div>
                      )}
                    </div>

                    {showRating && (
                      <div className="flex items-center p-2 justify-between text-xs text-gray-500">
                        <span>{getYear(item)}</span>
                        <span className="flex items-center gap-1">
                          <Star className="size-4 fill-light-green text-light-green" />
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {showMoreLink && (
          <div className="flex justify-end pt-2 px-3">
            <Link
              href={showMoreLink}
              className="text-gray-300 hover:text-white text-sm transition-all flex gap-1 items-center justify-center"
            >
              Show More
              <MoveRight className="size-5" />
            </Link>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="w-full max-w-6xl py-6 mx-auto p-4 md:px-0 flex flex-col gap-4">
      {renderHeader()}
      {renderContent()}
    </div>
  )
}

export default CinemaListComponent