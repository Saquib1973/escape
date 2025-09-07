import React from 'react'
import { getMovieDetails } from '../actions'
import MovieDetailsComponent from '@/components/movie/movie-details-component'
import Link from 'next/link'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const movie = await getMovieDetails(id)

  if (!movie) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Movie Not Found
          </h1>
          <p className="text-gray-300 mb-4">
            The movie you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href='/' className='bg-dark-gray-hover text-white px-4 py-2 cursor-pointer'>Go back to Home</Link>
        </div>
      </div>
    )
  }

  return <MovieDetailsComponent movie={movie} />
}

export default page
