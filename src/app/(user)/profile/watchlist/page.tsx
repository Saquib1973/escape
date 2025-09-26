import AnimatePageWrapper from '@/components/animate-page-wrapper'
import { Metadata } from 'next'
import { getSession } from '@/lib'
import { WatchlistService } from '@/lib/services/watchlist'
import WatchlistList from '@/components/watchlist/watchlist-list'

export const metadata: Metadata = {
  title: 'Your Watchlist',
}

async function getWatchlist() {
  const session = await getSession()
  const userId = session?.user?.id
  if (!userId) return []

  return WatchlistService.getUserWatchlist(userId)
}

export default async function WatchList() {
  const items = await getWatchlist()

  return (
    <AnimatePageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-medium text-white">Watchlist</h1>
          <p className="text-sm text-gray-400 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <WatchlistList items={items} />
      </div>
    </AnimatePageWrapper>
  )
}