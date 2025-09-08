import React from 'react'
import Image from 'next/image'
import Loader from '../loader'
import Link from 'next/link'

interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  first_air_date: string
  vote_average: number
}

interface TVSearchResultsProps {
  tvShows: TVShow[]
  query: string
  isLoading?: boolean
}

const TVSearchResults = ({
  tvShows,
  query,
  isLoading = false,
}: TVSearchResultsProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-5 ">
          <Loader text={`Searching ${query}`} />
        </div>
      )
    }

    if (tvShows.length === 0) {
      return (
        <p className="text-gray-400 text-sm">
          No TV shows related to &apos;{query}&apos; found
        </p>
      )
    }

    return (
      <div className="flex flex-col gap-1">
        {tvShows.map((show) => (
          <Link
            href={`/web-series/${show.id}`}
            key={show.id}
            className="flex gap-3 hover:bg-dark-gray-hover transition-colors cursor-pointer group"
          >
            <div className="relative w-20 h-32 flex-shrink-0">
              <Image
                src={
                  show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : '/placeholder-tv.jpg'
                }
                alt={show.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 p-2">
              <h3 className="font-medium text-white mb-1 group-hover:text-gray-200 transition-colors line-clamp-1">
                {show.name}
              </h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2 leading-relaxed">
                {show.overview}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{show.first_air_date?.split('-')[0] || 'N/A'}</span>
                <span className="text-yellow-400">
                  ★ {show.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-medium py-4">
        TV Shows related to &apos;{query}&apos;
      </h2>
      {renderContent()}
    </div>
  )
}

export default TVSearchResults
