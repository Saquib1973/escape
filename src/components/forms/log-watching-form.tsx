'use client'

import { Calendar, Film, Tv, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '../ui/input'
import Loader from '../ui/loader'

interface LogWatchingFormProps {
  contentId: string
  contentType: 'movie' | 'tv_series'
  contentTitle: string
  posterPath?: string
  onClose: () => void
  onSuccess?: () => void
}

export default function LogWatchingForm({
  contentId,
  contentType,
  contentTitle,
  posterPath,
  onClose,
  onSuccess,
}: Readonly<LogWatchingFormProps>) {
  const { data: session } = useSession()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      setError('You must be logged in to log watching activity')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/activity/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityType: contentType === 'tv_series' ? 'series_watched' : 'movie_watched',
          activityDate: selectedDate.toISOString(),
          contentId,
          metadata: {
            contentType,
            contentTitle,
            posterPath,
            loggedAt: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to log activity')
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Error logging watching activity:', err)
      setError('Failed to log watching activity. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

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
              <h2 className="text-2xl font-bold text-white">Log Watching Activity</h2>
              <p className="text-gray-400 text-sm">
                Track when you watched {contentTitle}
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
            {/* Content Info */}
            <div className="flex flex-col gap-1 py-2">
              <div className="flex items-center gap-3 p-3 bg-dark-gray rounded-lg">
                {contentType === 'tv_series' ? (
                  <Tv className="w-5 h-5 text-blue-400" />
                ) : (
                  <Film className="w-5 h-5 text-blue-400" />
                )}
                <div>
                  <h4 className="text-white font-medium">{contentTitle}</h4>
                  <p className="text-sm text-gray-400 capitalize">
                    {contentType === 'tv_series' ? 'TV Series' : 'Movie'}
                  </p>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="flex flex-col gap-1 py-2">
              <label htmlFor="watch-date" className="block text-sm font-medium text-gray-300 mb-2">
                When did you watch this?
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="watch-date"
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="pl-10 focus:ring-1 focus:ring-light-green"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Selected: {formatDate(selectedDate)}
              </p>
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
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-light-green text-white cursor-pointer hover:bg-light-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? <Loader color="white" size="sm" /> : 'Log Activity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
