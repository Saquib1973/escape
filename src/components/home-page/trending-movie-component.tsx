'use client'

import React from 'react'
import CinemaListComponent from '../cinema-list-component'
import { MediaItem } from '../../types/media'

const TrendingMovieComponent = () => {
  const getYear = (item: MediaItem) => {
    return new Date(item.release_date || '').getFullYear()
  }

  const getTitle = (item: MediaItem) => {
    return item.title || item.name || 'Unknown'
  }

  return (
    <CinemaListComponent
      title="Trending Movies"
      apiUrl="https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&region=IN"
      linkPath={(id) => `/movie/${id}`}
      scrollContainerClass="trending-scroll-container"
      showMoreLink="/trending"
      getYear={getYear}
      getTitle={getTitle}
    />
  )
}

export default TrendingMovieComponent
