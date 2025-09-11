"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type RatingEnum = 'TRASH' | 'TIMEPASS' | 'ONE_TIME_WATCH' | 'MUST_WATCH' | 'LEGENDARY'

export type GenericPost = {
  id: string
  title?: string | null
  content: string
  rating: RatingEnum | null
  isSpoiler?: boolean
  createdAt?: Date | string
  posterUrl?: string | null
  user: {
    name: string | null
    image: string | null
  }
  likes?: Array<{ id: string; userId: string }>
  dislikes?: Array<{ id: string; userId: string }>
  _count?: {
    comments: number
  }
}

type Props = {
  posts: GenericPost[]
  emptyText?: string
}

const ratingConfig: Record<RatingEnum, { label: string }> = {
  TRASH: { label: 'Trash' },
  TIMEPASS: { label: 'Timepass' },
  ONE_TIME_WATCH: { label: 'One-time watch' },
  MUST_WATCH: { label: 'Must watch' },
  LEGENDARY: { label: 'Legendary' },
}

const RatingBar: React.FC<{ rating: RatingEnum }> = ({ rating }) => {
  const cfg = ratingConfig[rating]
  return (
    <span className="text-gray-300 text-sm">{cfg.label}</span>
  )
}

const PostList: React.FC<Props> = ({ posts, emptyText = 'No posts yet' }) => {

  if (!posts || posts.length === 0) {
    return <div className="py-6 text-center text-gray-400">{emptyText}</div>
  }

  return (
    <div className="flex flex-col gap-3 py-6">
      <AnimatePresence mode="wait">
        {posts.map((post, index) => (
          <Link
            href={`/post/${post.id}`}
            key={post.id}
            className="cursor-pointer transition-colors p-6 px-0"
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                ease: 'easeOut',
                delay: (index + 1) * 0.05,
              }}
            >
              <div className="flex gap-4">
                {/* Poster (preferred) or fallback to user initial */}
                <div className="flex-shrink-0">
                  <div className="w-32 bg-dark-gray overflow-hidden">
                    <Image
                      src={post.posterUrl || '/logo.png'}
                      alt={post.title || 'Poster'}
                      width={96}
                      height={144}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (
                          target &&
                          target.src !== window.location.origin + '/logo.png'
                        ) {
                          target.src = ''
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  {/* User name and date */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium">
                      {post.user?.name || 'Anonymous'}
                    </span>
                    {post.createdAt ? (
                      <span className="text-gray-400 text-sm">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    ) : null}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center bg-dark-gray-2 w-fit px-3 gap-3 mb-2">
                    {post.rating ? <RatingBar rating={post.rating} /> : null}
                  </div>

                  {/* Title */}
                  {post.title && (
                    <h3 className="text-xl font-bold text-white mb-1">
                      {post.title}
                    </h3>
                  )}

                  {/* Spoiler */}
                  {post.isSpoiler ? (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 mb-3">
                      <p className="text-yellow-400 text-sm font-medium">
                        ⚠️ This post contains spoilers
                      </p>
                    </div>
                  ) : null}

                  {/* Content */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Reactions */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">
                        {post.likes?.length ?? 0}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">
                        {post.dislikes?.length ?? 0}
                      </span>
                    </button>
                    <div className="flex items-center gap-1 text-gray-400 ml-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">
                        {post._count?.comments ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 w-[80%] mx-auto h-0.5 bg-dark-gray-2/30" />
            </motion.div>
          </Link>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default PostList


