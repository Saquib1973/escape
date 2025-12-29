import Image from 'next/image'
import Link from 'next/link'
import { WatchlistItem } from '@/services/watchlist'
import RemoveWatchlistButton from './remove-button'

interface WatchlistItemProps {
  item: WatchlistItem
}

export default function WatchlistItemComponent({ item }: WatchlistItemProps) {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
      <Link href={item.href} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-16 bg-gray-700 rounded-sm overflow-hidden flex-shrink-0">
          {item.movie.posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w154${item.movie.posterPath}`}
              alt={item.displayTitle}
              width={48}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-600" />
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-gray-100 truncate">
              {item.displayTitle}
            </h3>
            {item.year && (
              <span className="text-xs text-gray-400 flex-shrink-0">
                {item.year}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Added {new Date(item.createdAt).toLocaleDateString()}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">
              {item.movie.type === 'tv_series' ? 'TV' : 'Movie'}
            </span>
          </div>
        </div>
      </Link>

      <RemoveWatchlistButton contentId={item.contentId} />
    </div>
  )
}
