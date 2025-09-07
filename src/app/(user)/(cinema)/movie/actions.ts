'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWUyYjQxN2E1YTBlMmVjODMxMWI5MmI2MDFlNTc0NyIsIm5iZiI6MTc1NTIwOTI1Mi42MDYwMDAyLCJzdWIiOiI2ODllNWUyNGEyOTE4ZDdkZWM4ZGJmMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6j_ocxIEWOsbgjBG_eYv80kApJeZvlX2aEOCK2Roctk'

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

export interface MovieDetails {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: unknown
  budget: number
  genres: Genre[]
  homepage: string
  id: number
  imdb_id: string | null
  origin_country: string[]
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: string
  revenue: number
  runtime: number | null
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

// Function to save movie ID to database (lightweight)
async function saveMovieIdToDatabase(movieId: string): Promise<void> {
  try {
    await prisma.movie.upsert({
      where: { id: movieId },
      update: {}, // No updates needed, just ensure it exists
      create: {
        id: movieId,
        type: "movie"
      }
    })
  } catch (error) {
    console.error('Error saving movie ID to database:', error)
  }
}

// Function to fetch movie from TMDB
async function fetchMovieFromTMDB(movieId: string): Promise<MovieDetails | null> {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}?language=en-US`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${TMDB_TOKEN}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: MovieDetails = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching movie details from TMDB:', error)
    return null
  }
}

// Main function that checks if movie exists in DB, then always fetches from TMDB
export async function getMovieDetails(movieId: string): Promise<MovieDetails | null> {
  try {
    // Check if movie exists in our database (for posts/comments)
    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId }
    })

    // Always fetch fresh data from TMDB
    console.log('Fetching movie data from TMDB...')
    const movieData = await fetchMovieFromTMDB(movieId)

    if (movieData) {
      // Save movie ID to database if it doesn't exist (for posts/comments)
      if (!existingMovie) {
        await saveMovieIdToDatabase(movieId)
        console.log('Movie ID saved to database for posts/comments')
      }
    }

    return movieData
  } catch (error) {
    console.error('Error in getMovieDetails:', error)
    return null
  }
}

// Function to get posts without comments for a specific movie
export async function getPostsWithoutComments(movieId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        contentId: movieId,
        comments: {
          none: {} // Posts that have no comments
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        likes: {
          select: {
            id: true,
            userId: true
          }
        },
        dislikes: {
          select: {
            id: true,
            userId: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return posts
  } catch (error) {
    console.error('Error fetching posts without comments:', error)
    return []
  }
}

// Function to get all posts for a movie (with comment counts)
export async function getAllMoviePosts(movieId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        contentId: movieId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        likes: {
          select: {
            id: true,
            userId: true
          }
        },
        dislikes: {
          select: {
            id: true,
            userId: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return posts
  } catch (error) {
    console.error('Error fetching movie posts:', error)
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

// Function to get all posts for the feed (across all movies)
export async function getAllFeedPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        movie: {
          select: {
            id: true,
            type: true
          }
        },
        likes: {
          select: {
            id: true,
            userId: true
          }
        },
        dislikes: {
          select: {
            id: true,
            userId: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limit to 20 most recent posts for feed
    })

    return posts
  } catch (error) {
    console.error('Error fetching feed posts:', error)
    return []
  }
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

    // Ensure the content exists in our database
    await prisma.movie.upsert({
      where: { id: data.contentId },
      update: {},
      create: { id: data.contentId, type: "movie" }
    })

    // Create the post
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content.trim(),
        rating: data.rating,
        isSpoiler: data.isSpoiler,
        contentId: data.contentId,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return post
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}
