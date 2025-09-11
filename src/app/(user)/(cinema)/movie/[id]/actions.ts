'use server'

import prisma from '@/lib/prisma'
// Post actions now live under `src/app/(user)/post/actions.ts`

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

async function fetchMovieFromTMDB(movieId: string): Promise<MovieDetails | null> {
  try {
    const url = `${process.env.TMDB_BASE_URL}/movie/${movieId}?language=en-US&api_key=${process.env.TMDB_TOKEN}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.TMDB_TOKEN}`
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