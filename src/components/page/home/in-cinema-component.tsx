'use client'

import React from 'react'
import CinemaList from '../../cinema-list'
import { MediaItem } from '../../../../types/media'

const InCinemaComponent = () => {
  const getYear = (item: MediaItem) => {
    return new Date(item.release_date || '').getFullYear()
  }

  const getTitle = (item: MediaItem) => {
    return item.title || item.name || 'Unknown'
  }

  return (
    <CinemaList
      title="Now in Cinema"
      subHeading="Discover what's trending in cinema"
      apiUrl="/api/now-playing"
      linkPath={(id) => `/movie/${id}`}
      scrollContainerClass="cinema-scroll-container"
      showMoreLink="/cinema"
      getYear={getYear}
      getTitle={getTitle}
      showEmptyState={true}
      contentType="movie"
      showDropdown={true}
    />
  )
}

export default InCinemaComponent