const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWUyYjQxN2E1YTBlMmVjODMxMWI5MmI2MDFlNTc0NyIsIm5iZiI6MTc1NTIwOTI1Mi42MDYwMDAyLCJzdWIiOiI2ODllNWUyNGEyOTE4ZDdkZWM4ZGJmMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6j_ocxIEWOsbgjBG_eYv80kApJeZvlX2aEOCK2Roctk'

export interface TMDBMovieDetails {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  runtime: number | null
  genres: Array<{
    id: number
    name: string
  }>
  production_companies: Array<{
    id: number
    name: string
    logo_path: string | null
  }>
}

export interface TMDBMoviePoster {
  movieId: string
  title: string
  posterUrl: string | null
  releaseYear: string | null
}

export interface TMDBTVSeriesDetails {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genres: Array<{
    id: number
    name: string
  }>
}

export interface TMDBTVSeriesPoster {
  seriesId: string
  title: string
  posterUrl: string | null
  releaseYear: string | null
}

// Function to fetch movie details from TMDB
export async function fetchMovieDetails(movieId: string): Promise<TMDBMovieDetails | null> {
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

    const data: TMDBMovieDetails = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching movie details from TMDB:', error)
    return null
  }
}

// Function to get movie poster URL
export function getMoviePosterUrl(posterPath: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
  if (!posterPath) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`
}

// Function to get movie backdrop URL
export function getMovieBackdropUrl(backdropPath: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
  if (!backdropPath) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`
}

// Function to get movie poster info for feed
export async function getMoviePosterInfo(movieId: string): Promise<TMDBMoviePoster | null> {
  try {
    const movieDetails = await fetchMovieDetails(movieId)

    if (!movieDetails) {
      return null
    }

    const releaseYear = movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear().toString() : null
    const posterUrl = getMoviePosterUrl(movieDetails.poster_path, 'w500')

    return {
      movieId,
      title: movieDetails.title,
      posterUrl,
      releaseYear
    }
  } catch (error) {
    console.error('Error getting movie poster info:', error)
    return null
  }
}

// Function to fetch TV series details from TMDB
export async function fetchTVSeriesDetails(seriesId: string): Promise<TMDBTVSeriesDetails | null> {
  try {
    const url = `${TMDB_BASE_URL}/tv/${seriesId}?language=en-US`
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

    const data: TMDBTVSeriesDetails = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching TV series details from TMDB:', error)
    return null
  }
}

// Function to get TV series poster info for feed
export async function getTVSeriesPosterInfo(seriesId: string): Promise<TMDBTVSeriesPoster | null> {
  try {
    const seriesDetails = await fetchTVSeriesDetails(seriesId)

    if (!seriesDetails) {
      return null
    }

    const releaseYear = seriesDetails.first_air_date ? new Date(seriesDetails.first_air_date).getFullYear().toString() : null
    const posterUrl = getMoviePosterUrl(seriesDetails.poster_path, 'w500') // Reuse the same function

    return {
      seriesId,
      title: seriesDetails.name,
      posterUrl,
      releaseYear
    }
  } catch (error) {
    console.error('Error getting TV series poster info:', error)
    return null
  }
}

// Function to get multiple movie poster info (for batch processing)
export async function getMultipleMoviePosterInfo(movieIds: string[]): Promise<Map<string, TMDBMoviePoster>> {
  const moviePosterMap = new Map<string, TMDBMoviePoster>()

  // Process in batches to avoid overwhelming the API
  const batchSize = 5
  for (let i = 0; i < movieIds.length; i += batchSize) {
    const batch = movieIds.slice(i, i + batchSize)

    const promises = batch.map(async (movieId) => {
      const posterInfo = await getMoviePosterInfo(movieId)
      if (posterInfo) {
        moviePosterMap.set(movieId, posterInfo)
      }
    })

    await Promise.all(promises)

    // Add a small delay between batches to be respectful to the API
    if (i + batchSize < movieIds.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return moviePosterMap
}

// Function to get multiple TV series poster info (for batch processing)
export async function getMultipleTVSeriesPosterInfo(seriesIds: string[]): Promise<Map<string, TMDBTVSeriesPoster>> {
  const seriesPosterMap = new Map<string, TMDBTVSeriesPoster>()

  // Process in batches to avoid overwhelming the API
  const batchSize = 5
  for (let i = 0; i < seriesIds.length; i += batchSize) {
    const batch = seriesIds.slice(i, i + batchSize)

    const promises = batch.map(async (seriesId) => {
      const posterInfo = await getTVSeriesPosterInfo(seriesId)
      if (posterInfo) {
        seriesPosterMap.set(seriesId, posterInfo)
      }
    })

    await Promise.all(promises)

    // Add a small delay between batches to be respectful to the API
    if (i + batchSize < seriesIds.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return seriesPosterMap
}
