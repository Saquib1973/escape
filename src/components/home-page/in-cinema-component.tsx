'use client'

import React from 'react'
import CinemaListComponent from '../cinema-list-component'
import { MediaItem } from '../../types/media'

const InCinemaComponent = () => {
  const getYear = (item: MediaItem) => {
    return new Date(item.release_date || '').getFullYear()
  }

  const getTitle = (item: MediaItem) => {
    return item.title || item.name || 'Unknown'
  }

  return (
    <CinemaListComponent
      title="Now in Cinema"
      apiUrl="/api/now-playing"
      linkPath={(id) => `/movie/${id}`}
      scrollContainerClass="cinema-scroll-container"
      showMoreLink="/cinema"
      getYear={getYear}
      getTitle={getTitle}
      showEmptyState={true}
    />
  )
}

export default InCinemaComponent