'use client'

import React from 'react'
import { X, Star, Film, Tv } from 'lucide-react'
import { MovieDetail, formatDate, getRatingColor, getRatingStars } from './types'

interface MovieDetailPanelProps {
  date: string
  movies: MovieDetail[]
  onClose: () => void
}

export default function MovieDetailPanel({
  date,
  movies,
  onClose
}: Readonly<MovieDetailPanelProps>) {

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold text-gray-900">
            {formatDate(date)}
          </h4>
          <span className="text-sm text-gray-500">
            ({movies.length} {movies.length === 1 ? 'movie' : 'movies'})
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto">
        {movies.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">
            No movies watched on this date
          </div>
        ) : (
          <div className="space-y-3">
            {movies.map((movie, index) => (
              <div
                key={`${movie.contentId}-${index}`}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {movie.metadata.contentType === 'tv_series' ? (
                      <Tv className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Film className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-gray-900 truncate text-sm">
                        {movie.metadata.reviewTitle || `Content ${movie.contentId.slice(0, 8)}`}
                      </h5>
                      {movie.metadata.isSpoiler && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                          Spoiler
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="capitalize">
                        {movie.metadata.contentType || 'movie'}
                      </span>

                      {movie.metadata.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span className={getRatingColor(movie.metadata.rating)}>
                            {getRatingStars(movie.metadata.rating)}/5
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
