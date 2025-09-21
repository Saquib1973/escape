'use client'
import { CreatePostForm } from '@/components/forms/create-post-form'
import LogWatchingForm from '@/components/forms/log-watching-form'
import { AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import AnimatePageWrapper from '../../animate-page-wrapper'
import { PostsSection } from '../../posts-section'
import AiRecommendationComponent from '../../ai-recommendation-component'
import MovieRecommendation from './movie-recommendation'
import MediaItemDropdown from '../../media-item-dropdown'
import { formatDate } from '@/lib'

import type { MovieDetails } from '@/types/tmdb'

interface MovieDetailsComponentProps {
  movie: MovieDetails | null
}

const MovieDetailsComponent: React.FC<MovieDetailsComponentProps> = ({
  movie,
}) => {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showLogForm, setShowLogForm] = useState(false)
  const [refreshPosts, setRefreshPosts] = useState(0)
  const router = useRouter()
  const { data: session } = useSession()


  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }


  const getImageUrl = (
    path: string | null,
    size: 'w500' | 'w780' | 'original' = 'w500'
  ) => {
    if (!path) return '/placeholder-movie.jpg'
    return `https://image.tmdb.org/t/p/${size}${path}`
  }

  const handleWatchlist = () => {
    if (!session) {
      router.push('/signin')
    }
    // Watchlist functionality not implemented yet
  }

    if (!movie) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Movie Not Found
            </h1>
            <p className="text-gray-300 mb-4">
              The movie you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link
              href="/"
              className="bg-dark-gray-hover text-white px-4 py-2 cursor-pointer"
            >
              Go back to Home
            </Link>
          </div>
        </div>
      )
    }

  const renderMobile = () => (
    <div className="md:hidden">
      <div className="flex items-start gap-4">
        <div className="w-[40%] max-w-[160px]">
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            height={240}
            width={160}
            className="w-full object-center"
          />
        </div>
        <div className="flex-1 text-gray-300">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-white mb-1">
              {movie.title}
            </h2>
            {movie.original_title !== movie.title && (
              <p className="text-base text-gray-200 mb-2">
                {movie.original_title}
              </p>
            )}
            {movie.tagline && (
              <p className="text-sm italic text-gray-400">
                &quot;{movie.tagline}&quot;
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({movie.vote_count})
              </span>
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-400">
              <span className="text-gray-300">Runtime:</span>{' '}
              {formatRuntime(movie.runtime)}
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-400">
              <span className="text-gray-300">Release:</span>{' '}
              {formatDate(movie.release_date)}
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-400">
              <span className="text-gray-300">Status:</span> {movie.status}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-0.5 bg-light-green/20 text-light-green text-xs font-medium border border-light-green/30"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative group">
              <MediaItemDropdown
                item={{
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  release_date: movie.release_date
                }}
                contentType="movie"
                onWatchlistToggle={handleWatchlist}
                isInWatchlist={false}
                customButton={
                  <button
                    className="h-9 px-3 inline-flex items-center gap-2 text-sm bg-dark-gray-hover/80 text-gray-200 hover:text-white hover:bg-dark-gray-2 transition-colors"
                    aria-label="Create Post"
                  >
                    <Plus className="size-4" />
                    Create Post
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* The rest (overview, production, languages, links) under the header on small screens */}
      <div className="mt-6 text-gray-300">
        <div className="py-3">
          <h3 className="text-lg text-white font-semibold mb-2">Overview</h3>
          <p className="leading-relaxed text-sm">{movie.overview}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {movie.production_companies.length > 0 && (
            <div>
              <h3 className="text-lg text-white font-semibold mb-2">
                Production Companies
              </h3>
              <div className="space-y-1 text-sm">
                {movie.production_companies.map((company) => (
                  <div key={company.id} className="flex items-center gap-2">
                    {company.logo_path && (
                      <Image
                        src={getImageUrl(company.logo_path)}
                        alt={company.name}
                        width={24}
                        height={24}
                        className="object-contain rounded"
                      />
                    )}
                    <span className="">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {movie.spoken_languages.length > 0 && (
            <div>
              <h3 className="text-lg text-white font-semibold mb-2">
                Spoken Languages
              </h3>
              <div className="space-y-1 text-sm">
                {movie.spoken_languages.map((language) => (
                  <span key={language.iso_639_1}>{language.english_name}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6">
          <div className="flex gap-4">
            {movie.imdb_id && (
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-400 font-medium underline-offset-4 hover:underline"
              >
                View on IMDb
              </a>
            )}
            {movie.homepage && (
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-400 font-medium underline-offset-4 hover:underline"
              >
                Official Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderDesktop = () => (
    <div className="hidden md:flex flex-col w-full lg:flex-row gap-8">
      {/* Poster */}
      <div className="md:sticky top-[70px] left-0 md:max-w-[20%] max-w-[50%] mx-auto w-full h-full">
        <Image
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          height={300}
          width={300}
          className="w-full object-center"
        />
      </div>

      {/* Movie Details */}
      <div className="flex w-full">
        <div className="text-gray-300 w-full">
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
            <div className="relative group">
              <MediaItemDropdown
                item={{
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  release_date: movie.release_date
                }}
                contentType="movie"
                onWatchlistToggle={handleWatchlist}
                isInWatchlist={false}
                customButton={
                  <button
                    className="flex gap-1 justify-center items-center p-2 bg-dark-gray-hover text-gray-300 hover:text-white transition-all duration-300"
                    aria-label="More options"
                  >
                    <Plus className="size-5" />
                  </button>
                }
              />
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
            <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
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
            <h3 className="text-lg text-white font-semibold mb-2">Overview</h3>
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
                    <div key={company.id} className="flex items-center gap-2">
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
  )



  return (
    <AnimatePageWrapper className="">
      <div className="px-4 md:px-0 py-4 ">
        {renderMobile()}
        {renderDesktop()}
      </div>
      <AiRecommendationComponent title={movie.title} />
      <MovieRecommendation id={movie.id} />

      {/* Posts Section */}
      <div className="px-4 md:px-0">
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
            contentType="movie"
            posterPath={movie.poster_path}
            onClose={() => setShowCreatePost(false)}
            onSuccess={() => {
              setRefreshPosts((prev) => prev + 1)
            }}
          />
        )}
      </AnimatePresence>

      {/* Log Watching Form */}
      <AnimatePresence mode="wait">
        {showLogForm && movie && (
          <LogWatchingForm
            contentId={movie.id.toString()}
            contentType="movie"
            contentTitle={movie.title}
            posterPath={movie.poster_path || undefined}
            onClose={() => setShowLogForm(false)}
            onSuccess={() => {
              // Optionally refresh activity data or show success message
            }}
          />
        )}
      </AnimatePresence>
    </AnimatePageWrapper>
  )
}

export default MovieDetailsComponent
