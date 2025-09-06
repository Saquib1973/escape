'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Loader from '../loader'

interface TVSeries {
  id: number
  name: string
  overview: string
  poster_path: string
  first_air_date: string
  vote_average: number
}

const SeriesRecommendation = ({ id }: { id: number }) => {
  const [series, setSeries] = useState<TVSeries[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const url = `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWUyYjQxN2E1YTBlMmVjODMxMWI5MmI2MDFlNTc0NyIsIm5iZiI6MTc1NTIwOTI1Mi42MDYwMDAyLCJzdWIiOiI2ODllNWUyNGEyOTE4ZDdkZWM4ZGJmMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6j_ocxIEWOsbgjBG_eYv80kApJeZvlX2aEOCK2Roctk'
          }
        }

        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations')
        }

        const data = await response.json()
        setSeries(data.results || [])
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError('Failed to load recommendations')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [id])

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.querySelector('.recommendations-scroll-container')
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const renderHeader = () => (
    <div className='flex justify-between items-center mb-4'>
      <h2 className='text-xl text-gray-300'>Recommended Series</h2>
      <div className="flex gap-2">
        <button
          onClick={() => handleScroll('left')}
          className="p-2 bg-dark-gray hover:bg-dark-gray-hover transition-colors"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="p-2 bg-dark-gray hover:bg-dark-gray-hover transition-colors"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full h-72 flex items-center justify-center">
          <Loader text='Loading recommendations..' />
        </div>
      )
    }

    if (error) {
      return (
        <div className="w-full h-72 flex items-center justify-center">
          <div className="text-red-400">{error}</div>
        </div>
      )
    }

    if (series.length === 0) {
      return (
        <div className="w-full h-72 flex items-center justify-center">
          <div className="text-gray-400">No recommendations available</div>
        </div>
      )
    }

    return (
      <div className="w-full h-fit">
        <div className="recommendations-scroll-container flex gap-2 overflow-x-auto scrollbar-hide">
          {series.map((show) => (
            <Link
              href={`/web-series/${show.id}`}
              key={show.id}
              className="flex-shrink-0 w-36"
            >
              <div className="bg-dark-gray-2 overflow-hidden h-full">
                <div className="flex flex-col w-full h-full">
                  <div className="h-full flex items-center justify-center">
                    {show.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                        alt={show.name}
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

                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl py-6 mx-auto p-4 md:px-0 flex flex-col gap-4">
      {renderHeader()}
      {renderContent()}
    </div>
  )
}

export default SeriesRecommendation