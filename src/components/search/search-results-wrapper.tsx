'use client'

import React from 'react'
import MovieSearchResults from './movie-search-results'
import TVSearchResults from './tv-search-results'
import { type Movie, type TVShow } from '@/app/(user)/search/tmdb-actions'

interface SearchResultsWrapperProps {
  movies: Movie[]
  tvShows: TVShow[]
  query: string
}

const SearchResultsWrapper = ({ movies, tvShows, query }: SearchResultsWrapperProps) => {
  return (
    <div className="flex-1 px-2 md:px-4">
      <div className="flex flex-col gap-4">
        <MovieSearchResults movies={movies} query={query} />
        <TVSearchResults tvShows={tvShows} query={query} />
      </div>
    </div>
  )
}

export default SearchResultsWrapper
