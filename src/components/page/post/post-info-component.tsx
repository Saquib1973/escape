import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PostActions from '@/components/post-actions'
import type { RatingEnum } from '@/types/post'
import { getRatingLabel, formatDateTime } from '@/lib'

interface PostInfoProps {
  post: {
    id: string
    title: string | null
    content: string
    rating: RatingEnum | null
    isSpoiler: boolean
    createdAt: Date
    user: {
      id: string
      name: string | null
      username: string | null
      image: string | null
    } | null
    movie: {
      id: string
      type: string
      posterPath: string | null
    } | null
  }
  posterUrl: string | null
  likesCount: number
  dislikesCount: number
  commentsCount: number
  isLoggedIn: boolean
  userLiked: boolean
  userDisliked: boolean
}

const PostInfo: React.FC<PostInfoProps> = ({
  post,
  posterUrl,
  likesCount,
  dislikesCount,
  commentsCount,
  isLoggedIn,
  userLiked,
  userDisliked
}) => {


  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {posterUrl && (
        <div className="md:w-60 max-w-40 w-full md:flex-shrink-0">
          <Image
            src={posterUrl}
            alt={post.title ?? 'Poster'}
            width={240}
            height={360}
            className="w-full h-auto object-cover border border-dark-gray"
          />
        </div>
      )}

      <div className="flex-1">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            {/* User Avatar */}
            <div className="size-8 rounded-full bg-light-green flex items-center justify-center overflow-hidden">
              {post.user?.image ? (
                <Image
                  src={post.user.image}
                  alt={post.user.name || 'User'}
                  width={32}
                  height={32}
                  unoptimized={post.user.image.includes('dicebear')}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm font-medium">
                  {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col text-xs text-gray-300">
                <p className="font-medium text-sm">
                  {post.user?.name || 'Anonymous'}
                </p>
                <Link
                  href={`/u/${post.user?.username}`}
                  className="font-medium hover:text-light-green transition-colors"
                >
                  {'@' + post.user?.username || '@anonymous'}
                </Link>
              </div>
            </div>
          </div>

          {post.title && (
            <h1 className="text-2xl text-white font-semibold mt-1">
              {post.title}
            </h1>
          )}

          {post.rating != null && (
            <div className="mt-2 text-gray-300 flex items-center gap-1">
              <span className="text-xs bg-dark-gray-2 px-2 py-0.5">
                {getRatingLabel(post.rating)}
              </span>
              <div className="text-xs bg-dark-gray-2 px-2 py-0.5">
                <span>{post.movie?.type}</span>
              </div>
              {post.isSpoiler && (
                <div className="ml-2 h-full rounded-full flex bg-orange-500 items-center gap-1 text-white px-2 text-xs">
                  <span>has spoiler</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        <span className="text-xs text-gray-400">
          {formatDateTime(post.createdAt)}
        </span>

        <PostActions
          postId={post.id}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
          commentsCount={commentsCount}
          isLoggedIn={isLoggedIn}
          userLiked={userLiked}
          userDisliked={userDisliked}
        />
      </div>
    </div>
  )
}

export default PostInfo
