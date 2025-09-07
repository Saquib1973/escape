'use client'

import React from 'react'
import CinemaListComponent from '../cinema-list-component'
import { MediaItem } from '../../types/media'

const TrendingWebSeriesComponent = () => {
  const getYear = (item: MediaItem) => {
    return new Date(item.first_air_date || '').getFullYear()
  }

  const getTitle = (item: MediaItem) => {
    return item.title || item.name || 'Unknown'
  }

  return (
    <CinemaListComponent
      title="Trending Web Series"
      apiUrl="https://api.themoviedb.org/3/trending/tv/day?language=en-US"
      linkPath={(id) => `/web-series/${id}`}
      scrollContainerClass="trending-tv-scroll-container"
      showMoreLink="/trending"
      getYear={getYear}
      getTitle={getTitle}
    />
  )
}

export default TrendingWebSeriesComponent
