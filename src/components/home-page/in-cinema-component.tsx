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
      apiUrl="https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=IN"
      linkPath={(id) => `/movie/${id}`}
      scrollContainerClass="cinema-scroll-container"
      showMoreLink="/cinema"
      getYear={getYear}
      getTitle={getTitle}
    />
  )
}

export default InCinemaComponent