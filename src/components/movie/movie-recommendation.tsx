'use client'

import React from 'react'
import CinemaListComponent from '../cinema-list-component'
import { MediaItem } from '../../types/media'

const MovieRecommendation = ({ id }: { id: number }) => {
  const getYear = (item: MediaItem) => {
    return new Date(item.release_date || '').getFullYear()
  }

  const getTitle = (item: MediaItem) => {
    return item.title || item.name || 'Unknown'
  }

  return (
    <CinemaListComponent
      title="Recommended Movies"
      apiUrl={`/api/recommendation/movie?id=${id}&page=1`}
      linkPath={(movieId) => `/movie/${movieId}`}
      scrollContainerClass="recommendations-scroll-container"
      getYear={getYear}
      getTitle={getTitle}
      showRating={true}
      showEmptyState={true}
    />
  )
}

export default MovieRecommendation
