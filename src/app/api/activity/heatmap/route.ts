import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib'
import { ActivityService } from '@/services/activity'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')

    let targetMonth = new Date()
    if (monthParam) {
      targetMonth = new Date(monthParam)
    }

    const heatmapData = await ActivityService.getHeatmapDataForMonth(session.user.id, targetMonth)

    return NextResponse.json({
      activities: heatmapData.activities,
      startOfMonth: heatmapData.startOfMonth.toISOString(),
      endOfMonth: heatmapData.endOfMonth.toISOString(),
    })
  } catch (error) {
    console.error('Error fetching heatmap data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch heatmap data' },
      { status: 500 }
    )
  }
}
