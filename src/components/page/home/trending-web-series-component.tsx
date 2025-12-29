'use client'

import React, { useState } from 'react'
import CinemaList from '../../cinema-list'
import { MediaItem } from '../../../../types/media'

const TrendingWebSeriesComponent = () => {
  const [watchlistItems, setWatchlistItems] = useState<Set<number>>(new Set())

  const getYear = (item: MediaItem) => {
    return new Date(item.first_air_date || '').getFullYear()
  }

  const getTitle = (item: MediaItem) => {
    return item.title || item.name || 'Unknown'
  }

  const handleWatchlistToggle = (item: MediaItem) => {
    setWatchlistItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(item.id)) {
        newSet.delete(item.id)
      } else {
        newSet.add(item.id)
      }
      return newSet
    })
  }

  const getWatchlistStatus = (item: MediaItem) => {
    return watchlistItems.has(item.id)
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
      contentType="tv_series"
      showDropdown={true}
      onWatchlistToggle={handleWatchlistToggle}
      getWatchlistStatus={getWatchlistStatus}
    />
  )
}

export default TrendingWebSeriesComponent
