import { getSession } from '@/lib/auth'
import { NextResponse, type NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({
      error: 'no session found',
    })
  }

  const userId = session?.user?.id

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const size = parseInt(searchParams.get('size') || '10')
  const skip = (page - 1) * size

  const [total, posts] = await Promise.all([
    prisma.post.count({
      where: { userId },
    }),
    prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: size,
    }),
  ])
  const totalPages = Math.max(Math.ceil(total / size), 1)
  const hasMore = page < totalPages

  return NextResponse.json({
    success: true,
    posts,
    pagination: {
      page,
      size,
      total,
      totalPages,
      hasMore,
    },
  })
}
