'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWUyYjQxN2E1YTBlMmVjODMxMWI5MmI2MDFlNTc0NyIsIm5iZiI6MTc1NTIwOTI1Mi42MDYwMDAyLCJzdWIiOiI2ODllNWUyNGEyOTE4ZDdkZWM4ZGJmMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6j_ocxIEWOsbgjBG_eYv80kApJeZvlX2aEOCK2Roctk'

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Network {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface Season {
  air_date: string | null
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  vote_average: number
}

export interface TVSeriesDetails {
  adult: boolean
  backdrop_path: string | null
  created_by: Array<{
    id: number
    credit_id: string
    name: string
    gender: number
    profile_path: string | null
  }>
  episode_run_time: number[]
  first_air_date: string
  genres: Genre[]
  homepage: string
  id: number
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: {
    id: number
    name: string
    overview: string
    vote_average: number
    vote_count: number
    air_date: string
    episode_number: number
    production_code: string
    runtime: number | null
    season_number: number
    show_id: number
    still_path: string | null
  } | null
  name: string
  next_episode_to_air: {
    id: number
    name: string
    overview: string
    vote_average: number
    vote_count: number
    air_date: string
    episode_number: number
    production_code: string
    runtime: number | null
    season_number: number
    show_id: number
    still_path: string | null
  } | null
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons: Season[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
}

// Function to save TV series ID to database (lightweight)
async function saveTVSeriesIdToDatabase(seriesId: string): Promise<void> {
  try {
    await prisma.movie.upsert({
      where: { id: seriesId },
      update: {}, // No updates needed, just ensure it exists
      create: {
        id: seriesId,
        type: 'tv_series',
      },
    })
  } catch (error) {
    console.error('Error saving TV series ID to database:', error)
  }
}

// Function to fetch TV series from TMDB
async function fetchTVSeriesFromTMDB(
  seriesId: string
): Promise<TVSeriesDetails | null> {
  try {
    const url = `${TMDB_BASE_URL}/tv/${seriesId}?language=en-US`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: TVSeriesDetails = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching TV series details from TMDB:', error)
    return null
  }
}

// Main function that checks if TV series exists in DB, then always fetches from TMDB
export async function getTVSeriesDetails(
  seriesId: string
): Promise<TVSeriesDetails | null> {
  try {
    // Check if TV series exists in our database (for posts/comments)
    const existingSeries = await prisma.movie.findUnique({
      where: { id: seriesId },
    })

    // Always fetch fresh data from TMDB
    console.log('Fetching TV series data from TMDB...')
    const seriesData = await fetchTVSeriesFromTMDB(seriesId)

    if (seriesData) {
      // Save TV series ID to database if it doesn't exist (for posts/comments)
      if (!existingSeries) {
        await saveTVSeriesIdToDatabase(seriesId)
        console.log('TV series ID saved to database for posts/comments')
      }
    }

    return seriesData
  } catch (error) {
    console.error('Error in getTVSeriesDetails:', error)
    return null
  }
}

// Function to get posts without comments for a specific TV series
export async function getPostsWithoutComments(seriesId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        contentId: seriesId,
        comments: {
          none: {}, // Posts that have no comments
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        dislikes: {
          select: {
            id: true,
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts
  } catch (error) {
    console.error('Error fetching posts without comments:', error)
    return []
  }
}

// Function to get all posts for a TV series (with comment counts)
export async function getAllTVSeriesPosts(seriesId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        contentId: seriesId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        dislikes: {
          select: {
            id: true,
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts
  } catch (error) {
    console.error('Error fetching TV series posts:', error)
    return []
  }
}

// Interface for creating a post
export interface CreatePostData {
  title?: string | null
  content: string
  rating?: number | null
  isSpoiler: boolean
  contentId: string
}

// Function to create a new post (Server Action)
export async function createPost(data: CreatePostData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error('You must be logged in to create a post')
    }

    // Validate required fields
    if (!data.content.trim()) {
      throw new Error('Post content is required')
    }

    if (!data.contentId) {
      throw new Error('Content ID is required')
    }

    // Validate rating if provided
    if (data.rating && (data.rating < 1 || data.rating > 10)) {
      throw new Error('Rating must be between 1 and 10')
    }

    // Ensure the TV series exists in our database
    await prisma.movie.upsert({
      where: { id: data.contentId },
      update: {},
      create: { id: data.contentId, type: 'tv_series' },
    })

    // Create the post
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content.trim(),
        rating: data.rating,
        isSpoiler: data.isSpoiler,
        contentId: data.contentId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return post
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}
