import AnimatePageWrapper from '@/components/animate-page-wrapper'
import PostActions from '@/components/post-actions'
import React from 'react'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPosterUrl } from '@/lib/tmdb'
import type { RatingEnum } from '@/types/post'
import { getSession } from '@/lib/auth'

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await getSession()

  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, username: true, image: true },
      },
      movie: {
        select: { id: true, type: true, posterPath: true },
      },
      likes: {
        select: { id: true, userId: true },
      },
      dislikes: {
        select: { id: true, userId: true },
      },
      _count: { select: { comments: true } },
    },
  })

  if (!post) return notFound()

  const posterUrl = getPosterUrl(post.movie?.posterPath ?? null, 'w500')

  // Check if current user has liked or disliked this post
  const userLiked = session?.user?.id
    ? post.likes.some((like) => like.userId === session.user.id)
    : false
  const userDisliked = session?.user?.id
    ? post.dislikes.some((dislike) => dislike.userId === session.user.id)
    : false

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const getRatingLabel = (rating: RatingEnum) => {
    const map: Record<RatingEnum, string> = {
      TRASH: 'Trash',
      TIMEPASS: 'Timepass',
      ONE_TIME_WATCH: 'One-time watch',
      MUST_WATCH: 'Must watch',
      LEGENDARY: 'Legendary',
    }
    return map[rating] || rating
  }

  return (
    <AnimatePageWrapper>
      <div className=" py-6 max-md:px-4">
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
                    {getRatingLabel(post.rating as RatingEnum)}
                  </span>
                  <div className="text-xs bg-dark-gray-2 px-2 py-0.5">
                    <span>{post.movie.type}</span>
                  </div>
                  {post.isSpoiler && (
                    <div className=" ml-2 h-full rounded-full flex bg-orange-500 items-center gap-1 text-white px-2 text-xs">
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
              {formatDate(post.createdAt)}
            </span>

            {/* Action Buttons */}
            <PostActions
              postId={post.id}
              likesCount={post.likes.length}
              dislikesCount={post.dislikes.length}
              commentsCount={post._count.comments}
              isLoggedIn={!!session?.user?.id}
              userLiked={userLiked}
              userDisliked={userDisliked}
            />
          </div>
        </div>
      </div>
    </AnimatePageWrapper>
  )
}

export default PostPage
