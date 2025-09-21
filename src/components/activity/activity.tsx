import React from 'react'
import ActivityStats from './activity-stats'
import { getSession } from '@/lib'
import ActivityHeatmap from './activity-heatmap'
import Link from 'next/link'

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

      {/* Quick Links */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/profile/reviews"
            className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Your Reviews
            </h3>
            <p className="text-sm text-gray-400">
              View and manage your movie and series reviews
            </p>
          </Link>

          <Link
            href="/profile/watchlist"
            className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Your Watchlist
            </h3>
            <p className="text-sm text-gray-400">
              Manage your saved movies and series
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Activity
