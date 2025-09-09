'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MovieSearchResults from './movie-search-results'
import TVSearchResults from './tv-search-results'
import { type Movie, type TVShow } from '@/app/(user)/search/tmdb-actions'

interface SearchResultsWrapperProps {
  movies: Movie[]
  tvShows: TVShow[]
  query: string
  activeTab: 'movies' | 'shows'
}

const SearchResultsWrapper = ({
  movies,
  tvShows,
  query,
  activeTab,
}: SearchResultsWrapperProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleTabChange = (tab: 'movies' | 'shows') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.push(`/search?${params.toString()}`)
  }
  const movieBtnRef = useRef<HTMLButtonElement | null>(null)
  const tvBtnRef = useRef<HTMLButtonElement | null>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  })

  const updateIndicator = () => {
    const target = activeTab === 'movies' ? movieBtnRef.current : tvBtnRef.current
    const container = containerRef.current
    if (!target || !container) return
    const targetRect = target.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const left = targetRect.left - containerRect.left
    const width = targetRect.width
    setIndicator({ left, width })
  }

  useLayoutEffect(() => {
    updateIndicator()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, movies?.length, tvShows?.length, query])

  useEffect(() => {
    const onResize = () => updateIndicator()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex-1 px-2 md:px-0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div ref={containerRef} className="relative flex items-center gap-4 text-gray-300">
            <button
              type="button"
              name='movies'
              ref={movieBtnRef}
              onClick={() => handleTabChange('movies')}
              className={'py-2 text-sm md:text-base transition-colors ' + `${activeTab==="movies" ? "text-white" : "text-gray-300"}`}
              aria-selected={activeTab === 'movies'}
              role="tab"
              >
              Movies
            </button>
            <button
              name='web-series'
              type="button"
              ref={tvBtnRef}
              onClick={() => handleTabChange('shows')}
              className={'py-2 text-sm md:text-base transition-colors ' + `${activeTab!=="movies" ? "text-white" : "text-gray-300"}`}
              aria-selected={activeTab === 'shows'}
              role="tab"
            >
              TV Shows
            </button>
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-[2px] h-1 bg-gray-300 transition-all duration-300 ease-out"
              style={{ left: `${indicator.left}px`, width: `${indicator.width}px` }}
            />
          </div>
        </div>

        {activeTab === 'movies' ? (
          <MovieSearchResults movies={movies} query={query} />
        ) : (
          <TVSearchResults tvShows={tvShows} query={query} />
        )}
      </div>
    </div>
  )
}

export default SearchResultsWrapper
