export interface SimplerPost {
  id: string
  title: string | null
  content: string
  rating: RatingEnum | null
  isSpoiler: boolean
  createdAt: string | Date
  contentId: string
  movieType?: string
}

export type RatingEnum =
  | 'TRASH'
  | 'TIMEPASS'
  | 'ONE_TIME_WATCH'
  | 'MUST_WATCH'
  | 'LEGENDARY'

export interface PaginatedPostsResponse {
  success: boolean
  posts: SimplerPost[]
  pagination: {
    page: number
    size: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}