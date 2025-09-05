'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MoveRight, Star } from 'lucide-react'
import Image from 'next/image'
import Loader from '../loader'

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  release_date: string
  vote_average: number
}

const InCinemaComponent = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=IN'
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWUyYjQxN2E1YTBlMmVjODMxMWI5MmI2MDFlNTc0NyIsIm5iZiI6MTc1NTIwOTI1Mi42MDYwMDAyLCJzdWIiOiI2ODllNWUyNGEyOTE4ZDdkZWM4ZGJmMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6j_ocxIEWOsbgjBG_eYv80kApJeZvlX2aEOCK2Roctk'
          }
        }

        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }

        const data = await response.json()
        setMovies(data.results || [])
      } catch (err) {
        console.error('Error fetching movies:', err)
        setError('Failed to load movies')
      } finally {
        setLoading(false)
      }
    }

    fetchNowPlayingMovies()
  }, [])

  if (loading) {
    return (
      <div className="w-full md:px-0 p-4 py-2 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className=" text-2xl text-gray-300">Now in Cinema</h1>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const container = document.querySelector(
                  '.movies-scroll-container'
                )
                if (container) {
                  container.scrollBy({ left: -400, behavior: 'smooth' })
                }
              }}
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
              onClick={() => {
                const container = document.querySelector(
                  '.movies-scroll-container'
                )
                if (container) {
                  container.scrollBy({ left: 400, behavior: 'smooth' })
                }
              }}
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
        <div className="w-full h-72 flex items-center justify-center">
          <Loader text="Loading movies.." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-4 flex md:px-0 flex-col gap-4">
        <div className="">
          <h1 className="pl-4 text-2xl text-gray-300">Now in Cinema</h1>
        </div>
        <div className="w-full h-72 flex items-center justify-center">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-6 p-4 md:px-0 flex flex-col gap-4">
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl text-gray-300'>Now in Cinema</h1>

        <div className="flex gap-2">
          <button
            onClick={() => {
              const container = document.querySelector('.movies-scroll-container');
              if (container) {
                container.scrollBy({ left: -400, behavior: 'smooth' });
              }
            }}
            className="p-2 bg-dark-gray hover:bg-dark-gray-hover transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              const container = document.querySelector('.movies-scroll-container');
              if (container) {
                container.scrollBy({ left: 400, behavior: 'smooth' });
              }
            }}
            className="p-2 bg-dark-gray hover:bg-dark-gray-hover transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="w-full h-fit">
        <div className="movies-scroll-container pr-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-48"
            >
              <div className="bg-dark-gray-2 overflow-hidden h-full">
                <div className="flex flex-col w-full h-full">
                  <div className="h-4/5 flex items-center justify-center">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
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

                  <div className="h-fit p-3">
                    <h3 className="text-sm font-medium text-gray-300 mb-1 line-clamp-1">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <span className="flex items-center gap-1">
                        <Star className='size-4 fill-light-green text-light-green' />
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2 px-3">
        <Link
          href="/cinema"
          className="text-gray-300 hover:text-white text-sm transition-all flex gap-1 items-center justify-center"
        >
          Show More
          <MoveRight className='size-5' />
        </Link>
      </div>
    </div>
  )
}

export default InCinemaComponent