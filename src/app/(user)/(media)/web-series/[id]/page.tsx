import React from 'react'
import TVSeriesClient from '@/components/page/tv-series/tv-series-client'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  return <TVSeriesClient seriesId={id} />
}

export default page