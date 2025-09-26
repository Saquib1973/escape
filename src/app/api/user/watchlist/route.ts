import { NextResponse } from 'next/server'
import { getSession, prisma } from '@/lib'

type SaveToWatchlistRequestBody = {
  contentId: string
  contentType?: 'movie' | 'tv_series'
  posterPath?: string | null
}

// GET /api/user/watchlist
// Authenticated stub: returns Not Implemented for now
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.watchlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        contentId: true,
        createdAt: true,
        movie: { select: { id: true, type: true, posterPath: true } },
      },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('[WATCHLIST_GET_ERROR]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST /api/user/watchlist
// Authenticated stub: accepts contentId, returns Not Implemented for now
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contentId, contentType, posterPath } = await request.json() as SaveToWatchlistRequestBody
    if (!contentId) {
      return NextResponse.json({ error: 'Invalid payload: contentId is required' }, { status: 400 })
    }

    // Ensure Movie exists; upsert with minimal cached data including posterPath if provided
    await prisma.movie.upsert({
      where: { id: contentId },
      update: {
        type: contentType ?? 'movie',
        posterPath: posterPath ?? undefined,
      },
      create: {
        id: contentId,
        type: contentType ?? 'movie',
        posterPath: posterPath ?? null,
      },
    })

    const item = await prisma.watchlistItem.upsert({
      where: { userId_contentId: { userId: session.user.id, contentId } },
      update: {},
      create: { userId: session.user.id, contentId },
      select: { contentId: true, createdAt: true },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('[WATCHLIST_POST_ERROR]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


