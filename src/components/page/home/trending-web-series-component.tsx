'use client'

import React from 'react'
import CinemaList from '../../cinema-list'
import { MediaItem } from '../../../types/media'

const TrendingWebSeriesComponent = () => {
  const getYear = (item: MediaItem) => {
    return new Date(item.first_air_date || '').getFullYear()
  }

  const getTitle = (item: MediaItem) => {
    return item.title || item.name || 'Unknown'
  }

  return (
    <CinemaList
      title="Trending Web Series"
      subHeading='Discover trending webseries'
      apiUrl="/api/trending-series"
      linkPath={(id) => `/web-series/${id}`}
      scrollContainerClass="trending-tv-scroll-container"
      showMoreLink="/trending"
      getYear={getYear}
      getTitle={getTitle}
      showEmptyState={true}
    />
  )
}

export default TrendingWebSeriesComponent
