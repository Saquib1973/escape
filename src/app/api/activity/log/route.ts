import { ActivityService } from '@/lib/services/activity'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/config/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { activityType, activityDate, contentId, metadata } = body

    // Validate required fields
    if (!activityType || !activityDate) {
      return NextResponse.json(
        { error: 'Missing required fields: activityType and activityDate' },
        { status: 400 }
      )
    }

    // Validate activityType
    if (!['movie_watched', 'series_watched'].includes(activityType)) {
      return NextResponse.json(
        { error: 'Invalid activityType. Must be movie_watched or series_watched' },
        { status: 400 }
      )
    }

    const activity = await ActivityService.logActivity({
      userId: session.user.id,
      activityType,
      activityDate: new Date(activityDate),
      contentId,
      metadata,
    })

    return NextResponse.json({ success: true, activity })
  } catch (error) {
    console.error('Error logging activity:', error)
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    )
  }
}
