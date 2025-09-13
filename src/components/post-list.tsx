'use client'
import { getRatingLabel } from '@/lib/utils'
import type { GenericPost } from '@/types/post'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MessageCircle,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  posts: GenericPost[]
  emptyText?: string
}

const UserAvatar: React.FC<{
  user: { name: string | null; image: string | null }
}> = ({ user }) => {
  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="w-10 h-10 rounded-full bg-light-green flex items-center justify-center overflow-hidden">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name || 'User'}
          width={40}
          height={40}
          unoptimized={user.image.includes('dicebear')}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-400 text-sm font-medium">
          {getInitials(user.name)}
        </span>
      )}
    </div>
  )
}

const PostList: React.FC<Props> = ({ posts, emptyText = 'No posts yet' }) => {
  if (!posts || posts.length === 0) {
    return <div className="py-6 text-center text-gray-400">{emptyText}</div>
  }

  return (
    <div className="flex flex-col gap-1 py-6">
      <AnimatePresence mode="wait">
        {posts.map((post, index) => (
          <Link
            href={`/post/${post.id}`}
            key={post.id}
            className="cursor-pointer hover:bg-dark-gray-2 group transition-colors"
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
              <div className="flex gap-4 ">
                {/* Poster (preferred) or fallback to user initial */}
                <div className="flex">
                  <div className="w-32 overflow-hidden">
                    <Image
                      src={post.posterUrl || '/logo.png'}
                      alt={post.title || 'Poster'}
                      width={96}
                      height={144}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (
                          target &&
                          target.src !== window.location.origin + '/logo.png'
                        ) {
                          target.src = window.location.origin + '/logo.png'
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Post Content */}
                <div className="flex flex-col py-4 min-w-0">
                  {/* User info with avatar */}
                  <div className="flex items-center gap-3 mb-3">
                    <UserAvatar user={post.user} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {post.user?.name || 'Anonymous'}
                        </span>
                        {post.isSpoiler && (
                          <div className="flex bg-orange-500 rounded-full items-center gap-1 text-white px-2 text-xs">
                            <span>has spoiler</span>
                          </div>
                        )}
                      </div>
                      {post.createdAt && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  {post.title && (
                    <h3 className="text-xl font-bold text-white mb-1">
                      {post.title}
                    </h3>
                  )}
                  {/* Rating and Movie Type */}
                  <div className="flex items-center text-xs text-gray-300 gap-1 mb-2">
                    {post.rating && (
                      <div className="flex items-center bg-dark-gray-2 w-fit px-2 py-0.5 gap-2">
                        {getRatingLabel(post.rating)}
                      </div>
                    )}
                    {post.movie && (
                      <div className="flex items-center h-full gap-1 text-xs bg-dark-gray-2 px-1 py-0.5">
                        <span className="capitalize">{post.movie.type}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-300">
                      <ThumbsUp className="size-4" />
                      <span className="text-sm font-medium">
                        {post.likes?.length ?? 0}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-300">
                      <ThumbsDown className="size-4" />
                      <span className="text-sm font-medium">
                        {post.dislikes?.length ?? 0}
                      </span>
                    </button>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MessageCircle className="size-4" />
                      <span className="text-sm font-medium">
                        {post._count?.comments ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default PostList
