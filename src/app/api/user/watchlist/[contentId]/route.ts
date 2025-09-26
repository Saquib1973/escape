import { NextResponse } from 'next/server'
import { getSession, prisma } from '@/lib'

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ contentId: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contentId } = await context.params
    if (!contentId) {
      return NextResponse.json({ error: 'Missing contentId' }, { status: 400 })
    }

    await prisma.watchlistItem.delete({
      where: { userId_contentId: { userId: session.user.id, contentId } },
    }).catch(() => undefined)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[WATCHLIST_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


