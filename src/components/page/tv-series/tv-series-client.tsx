'use client'

import { useQuery } from '@tanstack/react-query'
import TVSeriesDetailsComponent from './tv-series-details-component'
import Link from 'next/link'
import Loader from '@/components/ui/loader'

interface TVSeriesClientProps {
  seriesId: string
}

const TVSeriesClient: React.FC<TVSeriesClientProps> = ({ seriesId }) => {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const {
    data: series,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tv-series', seriesId],
    queryFn: async () => {
      const url = `${base}/api/tmdb/series?id=${encodeURIComponent(seriesId)}`
      const res = await fetch(url, { cache: 'no-store' })

      if (!res.ok) {
        throw new Error('Failed to fetch series details')
      }

      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader text={`Loading ${seriesId} series details...`} size='lg' />
      </div>
    )
  }
  else if(error || !series) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Series with id{' '}
            <span className="text-light-green">&apos;{seriesId}&apos;</span> Not
            Found
          </h1>
          <p className="text-gray-300 mb-4">
            The series you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/"
            className="bg-dark-gray-hover text-white px-4 py-2 cursor-pointer"
          >
            Go back to Home
          </Link>
        </div>
      </div>
    )
  }
  return <TVSeriesDetailsComponent series={series} />
}

export default TVSeriesClient
