import Loader from '@/components/ui/loader'
import React from 'react'

const LoadingSeries = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader text="Loading webseries details..." />
    </div>
  )
}

export default LoadingSeries
