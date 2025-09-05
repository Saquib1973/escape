import React from 'react'
import { getTVSeriesDetails } from '../actions'
import TVSeriesDetailsComponent from '@/components/tv-series/tv-series-details-component'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const series = await getTVSeriesDetails(id)

  if (!series) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            TV Series Not Found
          </h1>
          <p className="text-gray-600">
            The TV series you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    )
  }

  return <TVSeriesDetailsComponent series={series} />
}

export default page