import Loader from '@/components/ui/loader'
import React from 'react'

const LoadingMovie = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader text="Loading movie details..." />
    </div>
  )
}

export default LoadingMovie
