import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'

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
  _count?: {
    comments: number
  }
}

type Props = {
  posts: GenericPost[]
  emptyText?: string
}

const PostList: React.FC<Props> = ({ posts, emptyText = 'No posts yet' }) => {
  const ratingBadge = (rating: RatingEnum) => {
    const map: Record<RatingEnum, { label: string; className: string }> = {
      TRASH: { label: 'Trash', className: 'bg-red-900/30 text-red-300 border-red-500/30' },
      TIMEPASS: { label: 'Timepass', className: 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30' },
      ONE_TIME_WATCH: { label: 'One-time watch', className: 'bg-blue-900/20 text-blue-300 border-blue-500/30' },
      MUST_WATCH: { label: 'Must watch', className: 'bg-green-900/20 text-green-300 border-green-500/30' },
      LEGENDARY: { label: 'Legendary', className: 'bg-purple-900/20 text-purple-300 border-purple-500/30' },
    }
    const cfg = map[rating]
    return (
      <span className={`text-xs px-2 py-0.5 border ${cfg.className}`}>
        {cfg.label}
      </span>
    )
  }

  if (!posts || posts.length === 0) {
    return <div className="py-6 text-center text-gray-400">{emptyText}</div>
  }

  return (
    <div className="flex flex-col gap-3 py-6">
      {posts.map((post) => (
        <Link href={`/post/${post.id}`} key={post.id} className="cursor-pointer transition-colors p-6 md:px-2">
          <div className="flex gap-4">
            {/* Poster (preferred) or fallback to user initial */}
            <div className="flex-shrink-0">
              {post.posterUrl ? (
                <div className="w-16 h-24 bg-dark-gray overflow-hidden">
                  <Image
                    src={post.posterUrl}
                    alt={post.title || 'Poster'}
                    width={96}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-dark-gray flex items-center justify-center overflow-hidden rounded-full">
                  <span className="text-white text-lg font-semibold">
                    {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="flex-1 min-w-0">
              {/* User name and date */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-medium">{post.user?.name || 'Anonymous'}</span>
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
              <div className="flex items-center gap-3 mb-2">
                {post.rating && ratingBadge(post.rating)}
                <div className="flex items-center gap-1 text-gray-400">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post._count?.comments ?? 0}</span>
                </div>
              </div>

              {/* Title */}
              {post.title && (
                <h3 className="text-xl font-bold text-white mb-1">{post.title}</h3>
              )}

              {/* Spoiler */}
              {post.isSpoiler ? (
                <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 mb-3">
                  <p className="text-yellow-400 text-sm font-medium">⚠️ This post contains spoilers</p>
                </div>
              ) : null}

              {/* Content */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{post.content}</p>

              {/* Likes */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Like</span>
                </button>
                <span className="text-gray-400 text-sm">{post.likes?.length ?? 0} likes</span>
              </div>
            </div>
          </div>
          <div className="mt-6 w-[80%] mx-auto h-0.5 bg-dark-gray-2/30" />
        </Link>
      ))}
    </div>
  )
}

export default PostList


