'use client'
import { MovieDetails } from '@/app/(user)/movie/actions'
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import { CreatePostForm } from '@/components/forms/create-post-form'
import { PostsSection } from './posts-section'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatePageWrapper from '../animate-page-wrapper'
import { Bookmark, Bug, Menu, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import MovieRecommendation from './movie-recommendation'

interface MovieDetailsComponentProps {
  movie: MovieDetails
}

const MovieDetailsComponent: React.FC<MovieDetailsComponentProps> = ({
  movie,
}) => {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [refreshPosts, setRefreshPosts] = useState(0)
  const [menu, setMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenu(false)
      }
    }

    if (menu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menu])

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getImageUrl = (
    path: string | null,
    size: 'w500' | 'w780' | 'original' = 'w500'
  ) => {
    if (!path) return '/placeholder-movie.jpg'
    return `https://image.tmdb.org/t/p/${size}${path}`
  }

  const handleCreatePost = () => {
    setMenu(false)
    if (!session) {
      router.push('/signin')
      return
    }
    setShowCreatePost(true)
  }

  const handleWatchlist = () => {
    setMenu(false)
    if (!session) {
      router.push('/signin')
      return
    }
    // TODO: Implement watchlist functionality
    console.log('Add to watchlist:', movie.title)
  }

  return (
    <AnimatePageWrapper className="">
      <div className="px-4 md:px-0 py-8">
        <div className="flex flex-col w-full lg:flex-row gap-8">
          {/* Poster */}
          <div className="sticky top-[70px] left-0 max-w-1/3 w-full h-full">
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              height={250}
              width={250}
              className="w-full"
            />
          </div>

          {/* Movie Details */}
          <div className="flex">
            <div className="text-gray-300">
              {/* Title and Basic Info */}
              <div className="flex justify-between w-full">
                <div className="mb-2">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {movie.title}
                  </h1>
                  {movie.original_title !== movie.title && (
                    <p className="text-xl text-white mb-4">
                      {movie.original_title}
                    </p>
                  )}
                  {movie.tagline && (
                    <p className="text-lg italic text-gray-300 mb-4">
                      &quot;{movie.tagline}&quot;
                    </p>
                  )}
                </div>
                <div className="relative dropdown-container" ref={menuRef}>
                  {status === 'loading' ? (
                    <div className="flex gap-1 justify-center items-center p-2 bg-dark-gray-hover text-gray-600 animate-pulse">
                      <div className="w-5 h-5 bg-gray-600 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setMenu(!menu)}
                      className={`flex gap-1 justify-center items-center p-2 transition-all duration-300 ${
                        menu
                          ? 'bg-light-green text-white'
                          : 'bg-dark-gray-hover text-gray-300 hover:text-white'
                      }`}
                      aria-label="Open menu"
                    >
                      <Menu className="size-5" />
                    </button>
                  )}

                  <AnimatePresence mode="wait">
                    {menu && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-8 -right-0 bg-dark-gray-2 z-50"
                      >
                        <div className="flex flex-col gap-1 min-w-[160px]">
                          <motion.button
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.15 }}
                            onClick={handleCreatePost}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                          >
                            <Plus className="size-4" />
                            Create Post
                          </motion.button>
                          <motion.button
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, duration: 0.15 }}
                            onClick={handleWatchlist}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                          >
                            <Bookmark className="size-4" />
                            Add to Watchlist
                          </motion.button>
                          <motion.button
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.15 }}
                            onClick={() => {
                              alert('reported')
                            }}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                          >
                            <Bug className="size-4" />
                            Report
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Rating and Runtime */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-lg font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span className="">({movie.vote_count} votes)</span>
                </div>
                <div className="">
                  <span className="font-medium">Runtime:</span>{' '}
                  {formatRuntime(movie.runtime)}
                </div>
                <div className="">
                  <span className="font-medium">Release Date:</span>{' '}
                  {formatDate(movie.release_date)}
                </div>
                <div className="">
                  <span className="font-medium">Status:</span> {movie.status}
                </div>
              </div>

              {/* Genres */}
              <div className="py-3">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-0.5 bg-light-green text-white text-xs font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div className="py-3">
                <h3 className="text-lg text-white font-semibold mb-2">
                  Overview
                </h3>
                <p className="leading-relaxed text-sm">{movie.overview}</p>
              </div>

              {/* Production Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Production Companies */}
                {movie.production_companies.length > 0 && (
                  <div>
                    <h3 className="text-lg text-white font-semibold mb-2">
                      Production Companies
                    </h3>
                    <div className="space-y-1 text-sm">
                      {movie.production_companies.map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center gap-2"
                        >
                          {company.logo_path && (
                            <Image
                              src={getImageUrl(company.logo_path)}
                              alt={company.name}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          )}
                          <span className="">{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Production Countries */}
                {movie.production_countries.length > 0 && (
                  <div>
                    <h3 className="text-lg text-white font-semibold mb-2">
                      Production Countries
                    </h3>
                    <div className="space-y-1 text-sm">
                      {movie.production_countries.map((country) => (
                        <span key={country.iso_3166_1}>{country.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spoken Languages */}
                {movie.spoken_languages.length > 0 && (
                  <div>
                    <h3 className="text-lg text-white font-semibold mb-2">
                      Spoken Languages
                    </h3>
                    <div className="space-y-1 text-sm">
                      {movie.spoken_languages.map((language) => (
                        <span key={language.iso_639_1}>
                          {language.english_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* External Links */}
              <div className="pt-6">
                <div className="flex gap-4">
                  {movie.imdb_id && (
                    <a
                      href={`https://www.imdb.com/title/${movie.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-400 font-medium"
                    >
                      View on IMDb
                    </a>
                  )}
                  {movie.homepage && (
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-400 font-medium"
                    >
                      Official Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MovieRecommendation id={movie.id} />

      {/* Posts Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PostsSection
          movieId={movie.id.toString()}
          refreshTrigger={refreshPosts}
        />
      </div>

      {/* Create Post Popup */}
      <AnimatePresence mode="wait">
        {showCreatePost && (
          <CreatePostForm
            movieId={movie.id.toString()}
            movieTitle={movie.title}
            onClose={() => setShowCreatePost(false)}
            onSuccess={() => {
              // Trigger posts refresh instead of page reload
              setRefreshPosts((prev) => prev + 1)
            }}
          />
        )}
      </AnimatePresence>
    </AnimatePageWrapper>
  )
}

export default MovieDetailsComponent
