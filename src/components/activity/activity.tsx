import React from 'react'
import ActivityStats from './activity-stats'
import { getSession } from '@/lib'
import ActivityHeatmap from './activity-heatmap'

const Activity = async () => {
  const session = await getSession()

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
        <p className="text-gray-300">
          Here&apos;s an overview of your movie and series watching activity
        </p>
      </div>

      {/* Activity Overview */}
      <div className="space-y-8">
        <div>
          <ActivityStats userId={session?.user.id || ''} />
        </div>

        <div>
          <ActivityHeatmap />
        </div>
      </div>

    </div>
  )
}

export default Activity
