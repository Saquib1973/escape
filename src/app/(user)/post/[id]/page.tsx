import AnimatePageWrapper from '@/components/animate-page-wrapper'
import React from 'react'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const renderStars = (rating: number) => {
    const starCount = Math.floor(rating / 2)
    return (
      <span className="inline-flex gap-1 align-middle">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < starCount ? 'text-yellow-400' : 'text-gray-500'}>★</span>
        ))}
      </span>
    )
  }

  return (
    <AnimatePageWrapper>
        <div className=" py-6">
          <div className="mb-4">
            <div className="text-sm text-gray-400">
              <Link href={`/u/${post.user?.username}`}>{post.user?.username || 'Anonymous'}</Link> • {formatDate(post.createdAt)}
            </div>
            {post.title && (
              <h1 className="text-2xl text-white font-semibold mt-1">{post.title}</h1>
            )}
            {post.rating != null && (
              <div className="mt-2 text-gray-300 flex items-center gap-2">
                {renderStars(post.rating)}
                <span className="text-sm">{post.rating}/10</span>
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
    </AnimatePageWrapper>
  )
}

export default PostPage
