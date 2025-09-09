'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion';

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

  useEffect(() => {
    if (status !== 'authenticated') return
    let ignore = false
    async function run() {
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
        if (!ignore) setItems(Array.isArray(data?.items) ? data.items : [])
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (!ignore) setError(message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => {
      ignore = true
    }
  }, [body, status])

  if (status !== 'authenticated') return null
  if (error) {
    console.log(error);
    return
  }
  if (!items.length && !loading) return null

  return (
    <div className="my-6  text-gray-300 max-md:px-4">
      <h3 className="mb-3 text-lg font-semibold">
        {"AI Recommendation for " + title || 'Recommended for you'}
      </h3>
      {loading ? (
        <div className="flex flex-wrap gap-2" aria-busy="true">
          {skeletonKeys.map((key) => (
            <div
              key={`skeleton-${key}`}
              className="animate-pulse bg-dark-gray-hover/60 h-7 w-24"
            />
          ))}
        </div>
      ) : (
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
                className="bg-dark-gray-hover text-white px-3 py-1 text-sm transition-colors"
              >
                {rec.title}
              </motion.button>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

export default AiRecommendationComponent
