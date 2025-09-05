import AnimatePageWrapper from '@/components/animate-page-wrapper'
import React from 'react'
import { searchUsers, type SearchUserResult } from './action'
import { searchMovies, searchTVShows, type Movie, type TVShow } from './tmdb-actions'
import { UserSearchResults } from '@/components/search'
import SearchResultsWrapper from '@/components/search/search-results-wrapper'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams
  const query = params.q || ''

  let userSearchResults: SearchUserResult[] = []
  let movieSearchResults: Movie[] = []
  let tvSearchResults: TVShow[] = []

  if (query.trim()) {
    // Search for users, movies, and TV shows in parallel
    const [users, movies, tvShows] = await Promise.all([
      searchUsers(query),
      searchMovies(query),
      searchTVShows(query)
    ])

    userSearchResults = users
    movieSearchResults = movies
    tvSearchResults = tvShows
  }

  return (
    <AnimatePageWrapper>
      <div className="py-8">
        <h1 className="text-3xl text-gray-300 font-light mb-2">
          Search Results
        </h1>
        {query ? (
          <p className="text-gray-400 text-sm">
            You searched for: <span className="text-white">{query}</span>
          </p>
        ) : (
          <p className="text-gray-400 text-sm pl-1">No search query provided</p>
        )}
      </div>

      {query.trim() ? (
        <div className="flex w-full text-gray-300 gap-6">
          {/* Main content area for movies and TV shows */}
          <SearchResultsWrapper
            movies={movieSearchResults}
            tvShows={tvSearchResults}
            query={query}
          />

          {/* Right sidebar for user results */}
          <UserSearchResults users={userSearchResults} query={query} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">Enter a search query to find movies, TV shows, and users</p>
        </div>
      )}
    </AnimatePageWrapper>
  )
}

export default SearchPage
