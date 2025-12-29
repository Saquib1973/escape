import prisma from '@/lib/config/prisma'
import { Prisma } from '@prisma/client'

export type ActivityType = 'movie_watched' | 'series_watched'

export interface CreateActivityData {
  userId: string
  activityType: ActivityType
  activityDate: Date
  contentId?: string
  metadata?: Record<string, unknown>
}

export interface ActivityHeatmapData {
  date: string // YYYY-MM-DD format
  count: number
  level: number // 0-4 for heatmap intensity
}

export class ActivityService {
  /**
   * Log a user activity for a specific date
   */
  static async logActivity(data: CreateActivityData) {
    try {
      // Normalize the date to start of day to ensure consistent grouping
      const normalizedDate = new Date(data.activityDate)
      normalizedDate.setHours(0, 0, 0, 0)

      const activity = await prisma.userActivity.create({
        data: {
          userId: data.userId,
          activityType: data.activityType,
          activityDate: normalizedDate,
          contentId: data.contentId,
          metadata: data.metadata as Prisma.InputJsonValue,
        },
      })

      return activity
    } catch (error) {
      console.error('Error logging activity:', error)
      throw error
    }
  }

  /**
   * Get user activity statistics
   */
  static async getUserActivityStats(userId: string) {
    try {
      const now = new Date()
      const startOfYear = new Date(now.getFullYear(), 0, 1)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)

      // Only count movie/series watching activities
      const watchingActivitiesFilter = {
        activityType: {
          in: ['movie_watched', 'series_watched'],
        },
      }

      const runCounts = async () => {
        return await Promise.all([
          prisma.userActivity.count({
            where: {
              userId,
              ...watchingActivitiesFilter,
            },
          }),
          prisma.userActivity.count({
            where: {
              userId,
              activityDate: { gte: startOfYear },
              ...watchingActivitiesFilter,
            },
          }),
          prisma.userActivity.count({
            where: {
              userId,
              activityDate: { gte: startOfMonth },
              ...watchingActivitiesFilter,
            },
          }),
          prisma.userActivity.count({
            where: {
              userId,
              activityDate: { gte: startOfWeek },
              ...watchingActivitiesFilter,
            },
          }),
        ])
      }

      let totalActivities: number,
        yearActivities: number,
        monthActivities: number,
        weekActivities: number

      try {
        ;[totalActivities, yearActivities, monthActivities, weekActivities] =
          await runCounts()
      } catch (error: unknown) {
        // Handle transient connection closure (P1017) by reconnecting once
        const maybePrismaError = error as { code?: string }
        if (maybePrismaError?.code === 'P1017') {
          try {
            await prisma.$disconnect()
          } catch {}
          await prisma.$connect()
          ;[totalActivities, yearActivities, monthActivities, weekActivities] =
            await runCounts()
        } else {
          throw error
        }
      }

      return {
        totalActivities,
        yearActivities,
        monthActivities,
        weekActivities,
      }
    } catch (error) {
      console.error('Error fetching activity stats:', error)
      throw error
    }
  }

  /**
   * Get heatmap data for current and last month
   */
  static async getHeatmapData(userId: string) {
    try {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      // Get start of last month
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const startOfLastMonth = new Date(lastMonthYear, lastMonth, 1)


      // Get end of current month
      const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)

      // Only count movie/series watching activities
      const watchingActivitiesFilter = {
        activityType: {
          in: ['movie_watched', 'series_watched'],
        },
      }

      const activities = await prisma.userActivity.findMany({
        where: {
          userId,
          activityDate: {
            gte: startOfLastMonth,
            lte: endOfCurrentMonth,
          },
          ...watchingActivitiesFilter,
        },
        select: {
          activityDate: true,
          contentId: true,
          metadata: true,
        },
        orderBy: {
          activityDate: 'desc',
        },
      })

      // Group activities by date with detailed info
      const activityMap: Record<string, Array<{
        contentId: string
        metadata: Record<string, unknown>
        activityType: string
      }>> = {}

      activities.forEach(activity => {
        const dateStr = activity.activityDate.toISOString().split('T')[0]
        if (!activityMap[dateStr]) {
          activityMap[dateStr] = []
        }
        activityMap[dateStr].push({
          contentId: activity.contentId || '',
          metadata: (activity.metadata as Record<string, unknown>) || {},
          activityType: 'movie_watched' // We know it's one of the watching types
        })
      })

      return {
        activities: activityMap,
        startOfLastMonth,
        endOfCurrentMonth,
      }
    } catch (error) {
      console.error('Error fetching heatmap data:', error)
      throw error
    }
  }

  /**
   * Get heatmap data for a specific month
   */
  static async getHeatmapDataForMonth(userId: string, targetMonth: Date) {
    try {
      const year = targetMonth.getFullYear()
      const month = targetMonth.getMonth()

      // Get start and end of the target month
      const startOfMonth = new Date(year, month, 1)
      const endOfMonth = new Date(year, month + 1, 0)

      // Only count movie/series watching activities
      const watchingActivitiesFilter = {
        activityType: {
          in: ['movie_watched', 'series_watched'],
        },
      }

      const activities = await prisma.userActivity.findMany({
        where: {
          userId,
          activityDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          ...watchingActivitiesFilter,
        },
        select: {
          activityDate: true,
          contentId: true,
          metadata: true,
        },
        orderBy: {
          activityDate: 'desc',
        },
      })

      // Group activities by date with detailed info
      const activityMap: Record<string, Array<{
        contentId: string
        metadata: Record<string, unknown>
        activityType: string
      }>> = {}

      activities.forEach(activity => {
        const dateStr = activity.activityDate.toISOString().split('T')[0]
        if (!activityMap[dateStr]) {
          activityMap[dateStr] = []
        }
        activityMap[dateStr].push({
          contentId: activity.contentId || '',
          metadata: (activity.metadata as Record<string, unknown>) || {},
          activityType: 'movie_watched' // We know it's one of the watching types
        })
      })

      return {
        activities: activityMap,
        startOfMonth,
        endOfMonth,
      }
    } catch (error) {
      console.error('Error fetching heatmap data for month:', error)
      throw error
    }
  }
}