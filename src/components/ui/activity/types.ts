export interface MovieDetail {
  contentId: string
  metadata: {
    contentType?: 'movie' | 'tv_series'
    rating?: string
    isSpoiler?: boolean
    reviewTitle?: string
    loggedAt?: string
  }
  activityType: string
}

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getRatingColor = (rating: string) => {
  switch (rating) {
    case 'LEGENDARY': return 'text-yellow-400'
    case 'MUST_WATCH': return 'text-green-400'
    case 'ONE_TIME_WATCH': return 'text-blue-400'
    case 'TIMEPASS': return 'text-orange-400'
    case 'TRASH': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

export const getRatingStars = (rating: string) => {
  const ratingMap: Record<string, number> = {
    'TRASH': 1,
    'TIMEPASS': 2,
    'ONE_TIME_WATCH': 3,
    'MUST_WATCH': 4,
    'LEGENDARY': 5
  }
  return ratingMap[rating] || 0
}
