'use client'
import { TVSeriesDetails } from '@/app/(user)/web-series/actions'
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import { CreatePostForm } from '@/components/forms/create-post-form'
import { PostsSection } from '@/components/movie/posts-section'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatePageWrapper from '../animate-page-wrapper'
import { Bookmark, Bug, Menu, Plus } from 'lucide-react'
import SeriesRecommendation from './series-recommendation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface TVSeriesDetailsComponentProps {
  series: TVSeriesDetails
}

const TVSeriesDetailsComponent: React.FC<TVSeriesDetailsComponentProps> = ({
  series,
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
    if (!path) return '/placeholder-tv.jpg'
    return `https://image.tmdb.org/t/p/${size}${path}`
  }

  const formatEpisodeRuntime = (runtime: number[]) => {
    if (!runtime || runtime.length === 0) return 'N/A'
    const avgRuntime =
      runtime.reduce((sum, time) => sum + time, 0) / runtime.length
    return `${Math.round(avgRuntime)} min`
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
    console.log('Add to watchlist:', series.name)
  }

  return (
    <AnimatePageWrapper className="">
      <div className="px-4 md:px-0 py-8">
        <div className="flex flex-col w-full lg:flex-row gap-8">
          {/* Poster */}
          <div className="sticky top-[70px] left-0 max-w-1/3 w-full h-full">
            <Image
              src={getImageUrl(series.poster_path)}
              alt={series.name}
              height={250}
              width={250}
              className="w-full"
            />
          </div>

          {/* TV Series Details */}
          <div className="flex">
            <div className="text-gray-300">
              {/* Title and Basic Info */}
              <div className="flex justify-between w-full">
                <div className="mb-2">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {series.name}
                  </h1>
                  {series.original_name !== series.name && (
                    <p className="text-xl text-white mb-4">
                      {series.original_name}
                    </p>
                  )}
                  {series.tagline && (
                    <p className="text-lg italic text-gray-300 mb-4">
                      &quot;{series.tagline}&quot;
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

              {/* Rating and Series Info */}
              <div className="flex flex-wrap gap-4 mb-6">
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
                      {series.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span className="">({series.vote_count} votes)</span>
                </div>
                <div className="">
                  <span className="font-medium">Episodes:</span>{' '}
                  {series.number_of_episodes}
                </div>
                <div className="">
                  <span className="font-medium">Seasons:</span>{' '}
                  {series.number_of_seasons}
                </div>
                <div className="">
                  <span className="font-medium">Episode Runtime:</span>{' '}
                  {formatEpisodeRuntime(series.episode_run_time)}
                </div>
                <div className="">
                  <span className="font-medium">First Air Date:</span>{' '}
                  {formatDate(series.first_air_date)}
                </div>
                <div className="">
                  <span className="font-medium">Status:</span> {series.status}
                </div>
                <div className="">
                  <span className="font-medium">Type:</span> {series.type}
                </div>
              </div>

              {/* Genres */}
              <div className="py-3">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {series.genres.map((genre) => (
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
                <p className="leading-relaxed text-sm">{series.overview}</p>
              </div>

              {/* Created By */}
              {series.created_by.length > 0 && (
                <div className="py-3">
                  <h3 className="text-lg text-white font-semibold mb-2">
                    Created By
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {series.created_by.map((creator) => (
                      <span key={creator.id} className="">
                        {creator.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Networks */}
              {series.networks.length > 0 && (
                <div className="py-3">
                  <h3 className="text-lg text-white font-semibold mb-2">
                    Networks
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {series.networks.map((network) => (
                      <div key={network.id} className="flex items-center gap-2">
                        {network.logo_path && (
                          <Image
                            src={getImageUrl(network.logo_path)}
                            alt={network.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        )}
                        <span className="">{network.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Production Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Production Companies */}
                {series.production_companies.length > 0 && (
                  <div>
                    <h3 className="text-lg text-white font-semibold mb-2">
                      Production Companies
                    </h3>
                    <div className="space-y-1 text-sm">
                      {series.production_companies.map((company) => (
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
                {series.production_countries.length > 0 && (
                  <div>
                    <h3 className="text-lg text-white font-semibold mb-2">
                      Production Countries
                    </h3>
                    <div className="space-y-1 text-sm">
                      {series.production_countries.map((country) => (
                        <span key={country.iso_3166_1}>{country.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spoken Languages */}
                {series.spoken_languages.length > 0 && (
                  <div>
                    <h3 className="text-lg text-white font-semibold mb-2">
                      Spoken Languages
                    </h3>
                    <div className="space-y-1 text-sm">
                      {series.spoken_languages.map((language) => (
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
                  {series.homepage && (
                    <a
                      href={series.homepage}
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
      <SeriesRecommendation id={series.id} />

      {/* Posts Section */}
      <div className="px-4 md:px-0">
        <PostsSection
          movieId={series.id.toString()}
          refreshTrigger={refreshPosts}
        />
      </div>

      {/* Create Post Popup */}
      <AnimatePresence mode="wait">
        {showCreatePost && (
          <CreatePostForm
            movieId={series.id.toString()}
            movieTitle={series.name}
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

export default TVSeriesDetailsComponent
