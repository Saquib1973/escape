'use client'

import React from 'react'
import CinemaList from '../../cinema-list'
import { MediaItem } from '../../../../types/media'

const SeriesRecommendation = ({ id }: { id: number }) => {
  const getYear = (item: MediaItem) => {
    return new Date(item.first_air_date || '').getFullYear()
  }

  const getTitle = (item: MediaItem) => {
    return item.title || item.name || 'Unknown'
  }

  return (
    <CinemaList
      title="Recommended Series"
      apiUrl={`/api/recommendation/series?id=${id}&page=1`}
      linkPath={(seriesId) => `/web-series/${seriesId}`}
      scrollContainerClass="recommendations-scroll-container"
      getYear={getYear}
      getTitle={getTitle}
      showRating={true}
      showEmptyState={true}
      contentType="tv_series"
      showDropdown={true}
    />
  )
}

export default SeriesRecommendation