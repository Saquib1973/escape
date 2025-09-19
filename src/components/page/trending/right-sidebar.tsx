'use client'

import { TrendingItem } from '@/types/trending'
import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMediaReleaseYear, getMediaTitle } from '@/lib'

const RightSidebar = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['trending', 'sidebar', 'day'],
    queryFn: async () => {
      const [moviesResponse, tvResponse] = await Promise.all([
        fetch('/api/trending-movie?time_window=day', { method: 'GET' }),
        fetch('/api/trending-series?time_window=day', { method: 'GET' }),
      ])
      const [moviesData, tvData] = await Promise.all([
        moviesResponse.json(),
        tvResponse.json(),
      ])
      return {
        movies: (moviesData?.results ?? []).slice(0, 5) as TrendingItem[],
        tv: (tvData?.results ?? []).slice(0, 5) as TrendingItem[],
      }
    },
  })

  const trendingMovies = useMemo(() => data?.movies ?? [], [data])
  const trendingTV = useMemo(() => data?.tv ?? [], [data])

  return (
    <div className="flex max-md:hidden md:w-[30%] sticky top-20 right-0 flex-col gap-2 h-fit">
      <div className="py-8">
        {/* Trending Movies Section */}
        <div className="mb-8">
          <h1 className="text-gray-300 font-light text-xl pb-6">
            Trending movies
          </h1>
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <MoviesSkeleton />
            ) : (
              trendingMovies.map((item, index) => (
                <Link
                  key={item.id}
                  className="flex text-gray-400 gap-5 mb-4 hover:drop-shadow-md group"
                  href={`/movie/${item.id}`}
                >
                  <h1 className="text-5xl font-extrabold group-hover:text-light-green text-white transition-all duration-500">
                    0{index + 1}
                  </h1>
                  <div>
                    <div className="flex flex-col items-start justify-center text-dark-grey">
                      <p className="line-clamp-1 group-hover:text-white">
                        {getMediaTitle(item)}
                      </p>
                      <p className="min-w-fit text-xs">
                        {getMediaReleaseYear(item)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Trending TV Shows Section */}
        <div className="w-full">
          <h1 className="text-gray-300 font-light text-xl pb-6">
            Trending TV shows
          </h1>
          <div className="flex flex-col gap-2 w-full">
            {isLoading ? (
              <TVSkeleton />
            ) : (
              trendingTV.map((item, index) => (
                <Link
                  key={item.id}
                  className="flex text-gray-400 gap-5 mb-4 hover:drop-shadow-md group"
                  href={`/web-series/${item.id}`}
                >
                  <h1 className="text-5xl font-extrabold group-hover:text-light-green text-white transition-all duration-500">
                    0{index + 1}
                  </h1>
                  <div>
                    <div className="flex flex-col items-start justify-center text-dark-grey">
                      <p className="line-clamp-1 group-hover:text-white">
                        {getMediaTitle(item)}
                      </p>
                      <p className="min-w-fit text-xs">
                        {getMediaReleaseYear(item)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const TVSkeleton = () => (
  <div className="flex flex-col gap-2 w-full">
    {[1, 2, 3, 4, 5].map((index) => (
      <div
        key={`tv-skel-${index}`}
        className="w-full flex text-gray-400 gap-5 mb-4"
      >
        <h1 className="text-5xl font-extrabold text-dark-gray-2">0{index}</h1>
        <div>
          <div className="flex flex-col items-start justify-center text-dark-grey">
            <div className="w-24 h-4 bg-dark-gray-2 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-dark-gray-2 rounded animate-pulse mt-2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)
const MoviesSkeleton = () => (
  <div className="flex flex-col gap-2">
    {[1, 2, 3, 4, 5].map((index) => (
      <div
        key={`movie-skel-${index}`}
        className="flex text-gray-400 gap-5 mb-4"
      >
        <h1 className="text-5xl font-extrabold text-dark-gray-2">0{index}</h1>
        <div>
          <div className="flex flex-col items-start justify-center text-dark-grey">
            <div className="w-24 h-4 bg-dark-gray-2 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-dark-gray-2 rounded animate-pulse mt-2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default RightSidebar
