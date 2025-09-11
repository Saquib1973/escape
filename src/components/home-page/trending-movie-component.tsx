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
      apiUrl="/api/popular-movie"
      linkPath={(id) => `/movie/${id}`}
      scrollContainerClass="trending-scroll-container"
      showMoreLink="/trending"
      getYear={getYear}
      getTitle={getTitle}
      showEmptyState={true}
    />
  )
}

export default TrendingMovieComponent
