import Loader from '@/components/loader'
import React from 'react'

const LoadingMovie = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader text="Loading movie details..." />
    </div>
  )
}

export default LoadingMovie
