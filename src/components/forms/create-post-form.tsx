'use client'

import { createPost, type RatingEnum } from '@/app/(user)/post/actions'
import { getRatingLabel } from '@/lib'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import Loader from '../loader'
interface CreatePostFormProps {
  movieId: string
  movieTitle: string
  contentType?: 'movie' | 'tv_series'
  posterPath?: string | null
  onClose: () => void
  onSuccess?: () => void
}

export function CreatePostForm({
  movieId,
  movieTitle,
  contentType = 'movie',
  posterPath = null,
  onClose,
  onSuccess,
}: Readonly<CreatePostFormProps>) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState<RatingEnum | null>(null)
  const [isSpoiler, setIsSpoiler] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const ratingOptions: RatingEnum[] = ['TRASH','TIMEPASS','ONE_TIME_WATCH','MUST_WATCH','LEGENDARY']

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await createPost({
        title: title.trim() || null,
        content: content.trim(),
        rating: rating || null,
        isSpoiler,
        contentId: movieId,
        contentType,
        posterPath,
      })

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  const renderRatingSelect = () => (
    <select
      value={rating ?? ''}
      onChange={(e) => setRating((e.target.value || null) as RatingEnum | null)}
      className="text-input"
    >
      <option value="">No rating</option>
      {ratingOptions.map((opt) => (
        <option key={opt} value={opt}>
          {getRatingLabel(opt)}
        </option>
      ))}
    </select>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="bg-dark-gray-2 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div className="py-2">
              <h2 className="text-2xl font-bold text-white">Create Post</h2>
              <p className="text-gray-400 text-sm">
                Share your thoughts about {movieTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 cursor-pointer hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="">
            {/* Title */}
            <div className="flex flex-col gap-1 py-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a catchy title..."
                className="text-input"
              />
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-1 py-2">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
                Your Rating
              </label>
              <div id="rating">
                {renderRatingSelect()}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 py-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Review Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Share your thoughts about this ${contentType === 'tv_series' ? 'TV series' : 'movie'}...`}
                required
                rows={6}
                className="text-input"
              />
            </div>

            {/* Spoiler Checkbox */}
            <div className="flex items-center gap-1 py-2">
              <input
                type="checkbox"
                id="spoiler"
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
                className="w-5 h-5 text-light-green bg-dark-gray-hover border-gray-600 rounded focus:ring-light-green focus:ring-2"
              />
              <label htmlFor="spoiler" className="ml-2 text-sm text-gray-300">
                This post contains spoilers
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-md p-3">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-dark-gray cursor-pointer text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="flex-1 px-4 py-2 bg-light-green text-white cursor-pointer hover:bg-light-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Loader color='white' size='sm' /> : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
