import AnimatePageWrapper from '@/components/animate-page-wrapper'
import React from 'react'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getMoviePosterInfo, getTVSeriesPosterInfo } from '@/lib/tmdb'

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true,username:true, image: true },
      },
      movie: {
        select: { id: true, type: true },
      },
      likes: { select: { id: true } },
      dislikes: { select: { id: true } },
      _count: { select: { comments: true } },
    },
  })

  if (!post) return notFound()

  // Fetch poster image for convenience
  const posterInfo =
    post.movie.type === 'tv_series'
      ? await getTVSeriesPosterInfo(post.movie.id)
      : await getMoviePosterInfo(post.movie.id)

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  type RatingEnum = 'TRASH' | 'TIMEPASS' | 'ONE_TIME_WATCH' | 'MUST_WATCH' | 'LEGENDARY'
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

  return (
    <AnimatePageWrapper>
        <div className=" py-6 max-md:px-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {posterInfo?.posterUrl && (
              <div className="md:w-60 max-w-40 w-full md:flex-shrink-0">
                <Image
                  src={posterInfo.posterUrl}
                  alt={posterInfo.title}
                  width={240}
                  height={360}
                  className="w-full h-auto object-cover border border-dark-gray"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="mb-4">
                <div className="text-sm text-gray-400">
                  <Link href={`/u/${post.user?.username}`}>{post.user?.username || 'Anonymous'}</Link> • {formatDate(post.createdAt)}
                </div>
                {post.title && (
                  <h1 className="text-2xl text-white font-semibold mt-1">{post.title}</h1>
                )}
                {post.rating != null && (
                  <div className="mt-2 text-gray-300 flex items-center gap-2">
                    {ratingBadge(post.rating as RatingEnum)}
                  </div>
                )}
                {post.isSpoiler && (
                  <div className="mt-3 bg-yellow-900/20 border border-yellow-500/30 p-3">
                    <p className="text-yellow-400 text-sm font-medium">⚠️ This post contains spoilers</p>
                  </div>
                )}
              </div>

              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>

              <div className="mt-6 flex items-center gap-6 text-gray-400 text-sm">
                <span>Comments: {post._count.comments}</span>
                <span>Likes: {post.likes.length}</span>
                <span>Dislikes: {post.dislikes.length}</span>
                <span>Type: {post.movie.type}</span>
              </div>
            </div>
          </div>
        </div>
    </AnimatePageWrapper>
  )
}

export default PostPage
