export interface SimplerPost {
  id: string
  title: string | null
  content: string
  rating: number | null
  isSpoiler: boolean
  createdAt: string | Date
  contentId: string
}

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