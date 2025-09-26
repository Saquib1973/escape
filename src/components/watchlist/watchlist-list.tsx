import { WatchlistItem } from '@/lib/services/watchlist'
import WatchlistItemComponent from './watchlist-item'

interface WatchlistListProps {
  items: WatchlistItem[]
}

export default function WatchlistList({ items }: WatchlistListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-sm">Your watchlist is empty</div>
        <div className="text-gray-500 text-xs mt-1">
          Add movies and shows to get started
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <WatchlistItemComponent key={item.contentId} item={item} />
      ))}
    </div>
  )
}
