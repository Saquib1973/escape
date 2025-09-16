import AnimatePageWrapper from '@/components/animate-page-wrapper'
import React from 'react'
import { searchUsers, type SearchUserResult } from './action'
import {
  searchMovies,
  searchTVShows,
  type Movie,
  type TVShow,
} from './tmdb-actions'
import {
  SearchResultsWrapper,
  UserSearchResults,
} from '@/components/page/search'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; tab?: string }>
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams
  const query = params.q || ''
  const activeTab =
    params.tab === 'shows' || params.tab === 'movies' || params.tab === 'users'
      ? params.tab
      : 'movies'

  let userSearchResults: SearchUserResult[] = []
  let movieSearchResults: Movie[] = []
  let tvSearchResults: TVShow[] = []

  if (query.trim()) {
    // Search for users, movies, and TV shows in parallel
    const [users, movies, tvShows] = await Promise.all([
      searchUsers(query),
      searchMovies(query),
      searchTVShows(query),
    ])

    userSearchResults = users
    movieSearchResults = movies
    tvSearchResults = tvShows
  }

  return (
    <AnimatePageWrapper>
      <div className="py-8 max-md:px-2">
        <h1 className="text-3xl text-gray-300 font-light">Search Results</h1>
      </div>

      {query.trim() ? (
        <div className="flex max-md:flex-col-reverse w-full text-gray-300 gap-6">
          {/* Main content area for movies, TV shows, and users */}
          <SearchResultsWrapper
            movies={movieSearchResults}
            tvShows={tvSearchResults}
            users={userSearchResults}
            query={query}
            activeTab={activeTab}
          />

          <div className="max-md:hidden md:w-[30%]">
            <UserSearchResults users={userSearchResults} query={query} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">
            Enter a search query to find movies, TV shows, and users
          </p>
        </div>
      )}
    </AnimatePageWrapper>
  )
}

export default SearchPage
