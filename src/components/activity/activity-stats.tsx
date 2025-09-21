'use client'

import React from 'react'

interface ActivityStatsProps {
  userId: string
  className?: string
}

interface ActivityStatsData {
  totalActivities: number
  yearActivities: number
  monthActivities: number
  weekActivities: number
}

export default function ActivityStats({
  userId,
  className = '',
}: Readonly<ActivityStatsProps>) {
  const [stats, setStats] = React.useState<ActivityStatsData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/activity/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch activity stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching activity stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  if (loading) {
    return (
      <div className={`activity-stats ${className}`}>
        <div className="grid grid-cols-4 gap-3">
          {['total', 'year', 'month', 'week'].map((type) => (
            <div
              key={`loading-skeleton-${type}`}
              className="bg-gray-200 p-3 animate-pulse"
            >
              <div className="h-6 bg-gray-300"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className={`activity-stats ${className}`}>
        <div className="text-center text-gray-500 py-4">No activity data</div>
      </div>
    )
  }

  const statItems = [
    { label: 'Total', value: stats.totalActivities },
    { label: 'This Year', value: stats.yearActivities },
    { label: 'This Month', value: stats.monthActivities },
    { label: 'This Week', value: stats.weekActivities },
  ]

  return (
    <div className={`activity-stats ${className}`}>
      <div className="grid grid-cols-4 gap-3">
        {statItems.map((item) => (
          <div key={item.label} className="bg-dark-gray-hover p-3">
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-300">
                {item.value}
              </div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
