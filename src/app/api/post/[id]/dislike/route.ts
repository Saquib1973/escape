import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: postId } = await params
    const userId = session.user.id

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if user already disliked this post
    const existingDislike = await prisma.dislike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    if (existingDislike) {
      // Remove the dislike
      await prisma.dislike.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      })
      return NextResponse.json({ action: 'removed', message: 'Dislike removed' })
    }

    // Remove any existing like first
    await prisma.like.deleteMany({
      where: {
        userId,
        postId
      }
    })

    // Add the dislike
    await prisma.dislike.create({
      data: {
        userId,
        postId
      }
    })

    return NextResponse.json({ action: 'added', message: 'Post disliked' })
  } catch (error) {
    console.error('Error in dislike route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
