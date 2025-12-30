'use client'

import { useState } from 'react'
import { MediaItem } from '../../../../types/media'
import CinemaList from '../../cinema-list'

const TrendingMovieComponent = () => {
  const [watchlistItems, setWatchlistItems] = useState<Set<number>>(new Set())

  const getYear = (item: MediaItem) => {
    return new Date(item.release_date || '').getFullYear()
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
      title="Trending Movies"
      subHeading="Discover trending movies"
      apiUrl="/api/popular-movie"
      linkPath={(id) => `/movie/${id}`}
      scrollContainerClass="trending-scroll-container"
      showMoreLink="/trending"
      getYear={getYear}
      getTitle={getTitle}
      showEmptyState={true}
      contentType="movie"
      showDropdown={true}
      onWatchlistToggle={handleWatchlistToggle}
      getWatchlistStatus={getWatchlistStatus}
    />
  )
}

export default TrendingMovieComponent
