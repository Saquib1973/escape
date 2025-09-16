import AnimatePageWrapper from '@/components/animate-page-wrapper'
import PostInfo from '@/components/page/post/post-info-component'
import React from 'react'
import { prisma, getPosterUrl, getSession } from '@/lib'
import { notFound } from 'next/navigation'

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await getSession()

  const { id } = await params

  //get post from database
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

  // check if user liked/disliked post
  const userLiked = session?.user?.id
    ? post.likes.some((like) => like.userId === session.user.id)
    : false
  const userDisliked = session?.user?.id
    ? post.dislikes.some((dislike) => dislike.userId === session.user.id)
    : false


  return (
    <AnimatePageWrapper>
      <div className="py-6 max-md:px-4">
        <PostInfo
          post={post}
          posterUrl={posterUrl}
          likesCount={post.likes.length}
          dislikesCount={post.dislikes.length}
          commentsCount={post._count.comments}
          isLoggedIn={!!session?.user?.id}
          userLiked={userLiked}
          userDisliked={userDisliked}
        />
      </div>
    </AnimatePageWrapper>
  )
}

export default PostPage
