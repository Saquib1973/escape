import { getSession } from '@/lib'
import { ActivityService } from '@/services/activity'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await ActivityService.getUserActivityStats(session.user.id)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching activity stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity stats' },
      { status: 500 }
    )
  }
}
