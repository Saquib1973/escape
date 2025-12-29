import Loader from '@/components/ui/loader'
import Image from 'next/image'
import Link from 'next/link'

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

interface MovieSearchResultsProps {
  movies: Movie[]
  query: string
  isLoading?: boolean
}

const MovieSearchResults = ({ movies, query, isLoading = false }: MovieSearchResultsProps) => {

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-5 ">
          <Loader text={`Searching ${query}`} />
        </div>
      )
    }

    if (movies.length === 0) {
      return (
        <p className="text-gray-400 text-sm">
          No movies related to &apos;{query}&apos; found
        </p>
      )
    }

    return (
      <div className="flex flex-col gap-1">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} className="flex gap-3 hover:bg-dark-gray-hover transition-colors cursor-pointer group">
            <div className="relative w-20 h-32 flex-shrink-0">
              <Image
                src={movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/placeholder-movie.jpg'
                }
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 p-2">
              <h3 className="font-medium text-white mb-1 group-hover:text-gray-200 transition-colors line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2 leading-relaxed">
                {movie.overview}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                <span className="text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-medium py-4">Movies related to &apos;{query}&apos;</h2>
      {renderContent()}
    </div>
  )
}

export default MovieSearchResults
