'use client'
import React, { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

type Props = {
  contextType?: 'movie' | 'tv'
  contextId?: string
  likedMovies?: string[]
  likedTV?: string[]
  title?: string
}

type Rec = {
  type: 'movie' | 'tv'
  id: string
  title: string
}

const AiRecommendationComponent = ({
  contextType,
  contextId,
  likedMovies,
  likedTV,
  title,
}: Props) => {
  const [items, setItems] = useState<Rec[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const body = useMemo(
    () => ({ contextType, contextId, likedMovies, likedTV }),
    [contextType, contextId, likedMovies, likedTV]
  )
  const { status } = useSession()
  const router = useRouter()

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.06,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -4 },
    show: { opacity: 1, x: 0 },
  }

  const skeletonKeys = ['a','b','c','d','e','f','g','h']

  const fetchRecommendations = async () => {
    if (status !== 'authenticated') return

    try {
      setLoading(true)
      setError(null)
      const resp = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!resp.ok) throw new Error('Failed to fetch recommendations')
      const data = await resp.json()
      setItems(Array.isArray(data?.items) ? data.items : [])
      setHasFetched(true)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (status !== 'loading' && status !== 'authenticated')
    return null

  return (
    <div className="my-4 text-gray-300 max-md:px-4">
      {/* Content area that changes based on state */}
      <div className="min-h-[40px]">
        {!hasFetched && !loading && !error && (
          <button
            onClick={fetchRecommendations}
            className=" text-white cursor-pointer hover:text-light-green rounded-md text-sm font-medium transition-colors flex gap-1 items-center"
          >
            <Bot className="size-5" />
            <span>Get AI Recommendations</span>
          </button>
        )}

        {error && (
          <div className="text-red-400 text-sm">
            Failed to fetch recommendations.{' '}
            <button
              onClick={fetchRecommendations}
              className="ml-2 text-light-green hover:text-light-green/80 underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-light-green border-t-transparent"></div>
              <span>Generating AI recommendations...</span>
            </div>
            <div className="flex flex-wrap gap-2" aria-busy="true">
              {skeletonKeys.map((key) => (
                <div
                  key={`skeleton-${key}`}
                  className="animate-pulse bg-dark-gray-hover/60 h-7 w-24 rounded"
                />
              ))}
            </div>
          </div>
        )}

        {hasFetched && items.length > 0 && !loading && (
          <motion.div
            className="flex flex-wrap gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {items.map((rec) => {
              const href = `/search?q=${encodeURIComponent(
                rec.title.toLowerCase()
              )}`
              return (
                <motion.button
                  key={`${rec.type}-${rec.id}`}
                  variants={itemVariants}
                  onClick={() => router.push(href)}
                  className="bg-dark-gray-hover text-white px-3 py-1 text-sm transition-colors hover:bg-dark-gray-hover/80 rounded"
                >
                  {rec.title}
                </motion.button>
              )
            })}
          </motion.div>
        )}

        {hasFetched && items.length === 0 && !loading && (
          <div className="text-gray-400 text-sm">
            No recommendations available at the moment.{' '}
            <button
              onClick={fetchRecommendations}
              className="ml-2 text-light-green hover:text-light-green/80 underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AiRecommendationComponent
