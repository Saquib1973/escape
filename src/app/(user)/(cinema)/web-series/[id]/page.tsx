import React from 'react'
import TVSeriesDetailsComponent from '@/components/tv-series/tv-series-details-component'
import Link from 'next/link'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${base}/api/series?id=${encodeURIComponent(id)}`
  const res = await fetch(url, { cache: 'no-store' })
  const series = res.ok ? await res.json() : null

  if (!series) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Series Not Found
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

export default page