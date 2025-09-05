import AnimatePageWrapper from '@/components/animate-page-wrapper'
import React from 'react'

const NewArrivalsPage = () => {
  return (
    <AnimatePageWrapper className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">New Arrivals</h1>
        <p className="text-gray-400 mt-2">Latest movies and shows added to the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder content */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
          <p className="text-gray-400">New arrivals will be displayed here</p>
        </div>
      </div>
    </AnimatePageWrapper>
  )
}

export default NewArrivalsPage