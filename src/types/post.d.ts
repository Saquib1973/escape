export type RatingEnum =
  | 'TRASH'
  | 'TIMEPASS'
  | 'ONE_TIME_WATCH'
  | 'MUST_WATCH'
  | 'LEGENDARY'

  export type GenericPost = {
    id: string
    title?: string | null
    content: string
    rating: RatingEnum | null
    isSpoiler?: boolean
    createdAt?: Date | string
    posterUrl?: string | null
    user: {
      name: string | null
      image: string | null
    }
    movie?: {
      id: string
      type: string
      posterPath?: string | null
    }
    likes?: Array<{ id: string; userId: string }>
    dislikes?: Array<{ id: string; userId: string }>
    _count?: {
      comments: number
    }
  }
  interface Post {
    id: string
    title: string | null
    content: string
    rating: RatingEnum | null
    isSpoiler: boolean
    createdAt: Date
    movie?: { id: string; type: string; posterPath?: string | null }
    posterUrl?: string | null
    user: {
      id: string
      name: string | null
      image: string | null
    }
    likes: Array<{ id: string; userId: string }>
    _count: {
      comments: number
    }
  }