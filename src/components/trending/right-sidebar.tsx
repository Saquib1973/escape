'use client'

import { TrendingItem } from '@/types/trending'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const RightSidebar = () => {
  // states
  const [trendingMovies, setTrendingMovies] = useState<TrendingItem[]>([])
  const [trendingTV, setTrendingTV] = useState<TrendingItem[]>([])
  const [loading, setLoading] = useState(true)

  // effects
  useEffect(() => {
    fetchTrendingData()
  }, [])

  // function to get trending data
  const fetchTrendingData = async () => {
    try {
      setLoading(true)

      // Fetch trending movies
      const moviesUrl = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US'
      const moviesResponse = await fetch(moviesUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWUyYjQxN2E1YTBlMmVjODMxMWI5MmI2MDFlNTc0NyIsIm5iZiI6MTc1NTIwOTI1Mi42MDYwMDAyLCJzdWIiOiI2ODllNWUyNGEyOTE4ZDdkZWM4ZGJmMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6j_ocxIEWOsbgjBG_eYv80kApJeZvlX2aEOCK2Roctk'
        }
      })

      // Fetch trending TV shows
      const tvUrl = 'https://api.themoviedb.org/3/trending/tv/day?language=en-US'
      const tvResponse = await fetch(tvUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWUyYjQxN2E1YTBlMmVjODMxMWI5MmI2MDFlNTc0NyIsIm5iZiI6MTc1NTIwOTI1Mi42MDYwMDAyLCJzdWIiOiI2ODllNWUyNGEyOTE4ZDdkZWM4ZGJmMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6j_ocxIEWOsbgjBG_eYv80kApJeZvlX2aEOCK2Roctk'
        }
      })

      if (moviesResponse.ok && tvResponse.ok) {
        const moviesData = await moviesResponse.json()
        const tvData = await tvResponse.json()

        setTrendingMovies(moviesData.results?.slice(0, 5) || [])
        setTrendingTV(tvData.results?.slice(0, 5) || [])
      }
    } catch (error) {
      console.error('Error fetching trending data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTitle = (item: TrendingItem) => item.title || item.name || 'Unknown'
  const getReleaseYear = (item: TrendingItem) => {
    const date = item.release_date || item.first_air_date
    return date ? new Date(date).getFullYear() : 'N/A'
  }

  if (loading) {
    return (
      <div className="max-md:hidden flex flex-col gap-2 md:w-[30%] sticky top-20 right-0 h-fit">
        <div className="flex w-full flex-col gap-2">
          <div className="mx-auto px-4 py-8">
            <h1 className="text-gray-300 font-light text-xl pb-6">
              Trending movies
            </h1>
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex text-gray-400 gap-5 mb-4">
                  <h1 className="text-5xl font-extrabold text-dark-gray-2">
                    0{index}
                  </h1>
                  <div>
                    <div className="flex flex-col items-start justify-center text-dark-grey">
                      <div className="w-24 h-4 bg-dark-gray-2 rounded animate-pulse"></div>
                      <div className="w-16 h-3 bg-dark-gray-2 rounded animate-pulse mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="mx-auto px-4 py-8">
            <h1 className="text-gray-300 font-light text-xl pb-6">
              Trending movies
            </h1>
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex text-gray-400 gap-5 mb-4">
                  <h1 className="text-5xl font-extrabold text-dark-gray-2">
                    0{index}
                  </h1>
                  <div>
                    <div className="flex flex-col items-start justify-center text-dark-grey">
                      <div className="w-24 h-4 bg-dark-gray-2 rounded animate-pulse"></div>
                      <div className="w-16 h-3 bg-dark-gray-2 rounded animate-pulse mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex max-md:hidden md:w-[30%] sticky top-20 right-0 flex-col gap-2 h-fit">
      <div className=" mx-auto px-4 py-8">
        {/* Trending Movies Section */}
        <div className="mb-8">
          <h1 className="text-gray-300 font-light text-xl pb-6">
            Trending movies
          </h1>
          <div className="flex flex-col gap-2">
            {trendingMovies.map((item, index) => (
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
                      {getTitle(item)}
                    </p>
                    <p className="min-w-fit text-xs">{getReleaseYear(item)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending TV Shows Section */}
        <div>
          <h1 className="text-gray-300 font-light text-xl pb-6">
            Trending TV shows
          </h1>
          <div className="flex flex-col gap-2">
            {trendingTV.map((item, index) => (
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
                      {getTitle(item)}
                    </p>
                    <p className="min-w-fit text-xs">{getReleaseYear(item)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar