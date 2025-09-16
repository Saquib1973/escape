'use client'

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import MovieSearchResults from './movie-search-results'
import TVSearchResults from './tv-search-results'
import UserSearchResults from './user-search-results'
import { type Movie, type TVShow } from '@/app/(user)/search/tmdb-actions'
import { type SearchUserResult } from '@/app/(user)/search/action'

interface SearchResultsWrapperProps {
  movies: Movie[]
  tvShows: TVShow[]
  users: SearchUserResult[]
  query: string
  activeTab: 'movies' | 'shows' | 'users'
}

const SearchResultsWrapper = ({
  movies,
  tvShows,
  users,
  query,
  activeTab,
}: SearchResultsWrapperProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleTabChange = (tab: 'movies' | 'shows' | 'users') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.push(`/search?${params.toString()}`)
  }
  const movieBtnRef = useRef<HTMLButtonElement | null>(null)
  const tvBtnRef = useRef<HTMLButtonElement | null>(null)
  const userBtnRef = useRef<HTMLButtonElement | null>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  })

  const updateIndicator = useCallback(() => {
    let target: HTMLButtonElement | null = null
    if (activeTab === 'movies') target = movieBtnRef.current
    else if (activeTab === 'shows') target = tvBtnRef.current
    else if (activeTab === 'users') target = userBtnRef.current

    const container = containerRef.current
    if (!target || !container) return

    const targetRect = target.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const left = targetRect.left - containerRect.left
    const width = targetRect.width

    setIndicator({ left, width })
  }, [activeTab])

  useLayoutEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  useEffect(() => {
    const onResize = () => updateIndicator()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [updateIndicator])

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
              className={'py-2 text-sm md:text-base transition-colors ' + `${activeTab==="shows" ? "text-white" : "text-gray-300"}`}
              aria-selected={activeTab === 'shows'}
              role="tab"
            >
              TV Shows
            </button>
            <button
              name='users'
              type="button"
              ref={userBtnRef}
              onClick={() => handleTabChange('users')}
              className={'py-2 text-sm md:text-base transition-colors md:hidden ' + `${activeTab==="users" ? "text-white" : "text-gray-300"}`}
              aria-selected={activeTab === 'users'}
              role="tab"
            >
              Users
            </button>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-[2px] h-1 bg-gray-300"
              initial={false}
              animate={{
                left: indicator.left,
                width: indicator.width,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
            />
          </div>
        </div>

        {activeTab === 'movies' && <MovieSearchResults movies={movies} query={query} />}
        {activeTab === 'shows' && <TVSearchResults tvShows={tvShows} query={query} />}
        {activeTab === 'users' && <UserSearchResults users={users} query={query} />}
      </div>
    </div>
  )
}

export default SearchResultsWrapper
