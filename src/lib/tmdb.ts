import type { TMDBMovieDetails, TMDBMoviePoster, TMDBTVSeriesDetails, TMDBTVSeriesPoster } from '@/types/tmdb'

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'


/* ===========================
 * Movies
 * =========================== */

/**
 * Fetch full movie details from TMDB.
 *
 * - **Does**: Calls TMDB `/movie/{movieId}` with `language=en-US`.
 * - **Takes**: `movieId` (string TMDB movie ID).
 * - **Returns**: `TMDBMovieDetails` on success, otherwise `null` and logs error.
 *
 */
export async function fetchMovieDetails(movieId: string): Promise<TMDBMovieDetails | null> {
  try {
    const url = `${process.env.TMDB_BASE_URL}/movie/${movieId}?language=en-US`
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

    const data: TMDBMovieDetails = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching movie details from TMDB:', error)
    return null
  }
}

/**
 * Build a TMDB movie poster URL for a given path.
 *
 * - **Does**: Concatenates TMDB image base with `posterPath` and size.
 * - **Takes**:
 *    - `posterPath`: Path from TMDB responses (may be `null`).
 *    - `size`: TMDB size key (default `'w500'`).
 * - **Returns**: Full poster URL string or `null` if no path.
 */
export function getMoviePosterUrl(
  posterPath: string | null,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (!posterPath) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`
}

/**
 * Build a TMDB movie backdrop URL for a given path.
 *
 * - **Does**: Concatenates TMDB image base with `backdropPath` and size.
 * - **Takes**:
 *    - `backdropPath`: Path from TMDB responses (may be `null`).
 *    - `size`: TMDB size key (default `'w1280'`).
 * - **Returns**: Full backdrop URL string or `null` if no path.
 */
export function getMovieBackdropUrl(
  backdropPath: string | null,
  size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'
): string | null {
  if (!backdropPath) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`
}

/**
 * Fetch movie details and map into a lightweight poster info object.
 *
 * - **Does**: Fetches details → extracts title, year, poster URL.
 * - **Takes**: `movieId` (string TMDB movie ID).
 * - **Returns**: `TMDBMoviePoster` on success, otherwise `null`.
 */
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


/* ===========================
 * TV Series
 * =========================== */

/**
 * Fetch full TV series details from TMDB.
 *
 * - **Does**: Calls TMDB `/tv/{seriesId}` with `language=en-US`.
 * - **Takes**: `seriesId` (string TMDB TV series ID).
 * - **Returns**: `TMDBTVSeriesDetails` on success, otherwise `null` and logs error.
 *
 */
export async function fetchTVSeriesDetails(seriesId: string): Promise<TMDBTVSeriesDetails | null> {
  try {
    const url = `${process.env.TMDB_BASE_URL}/tv/${seriesId}?language=en-US`
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

    const data: TMDBTVSeriesDetails = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching TV series details from TMDB:', error)
    return null
  }
}

/**
 * Fetch TV series details and map into a lightweight poster info object.
 *
 * - **Does**: Fetches details → extracts name, first air year, poster URL.
 * - **Takes**: `seriesId` (string TMDB TV series ID).
 * - **Returns**: `TMDBTVSeriesPoster` on success, otherwise `null`.
 */
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


/* ===========================
 * helpers
 * =========================== */

/**
 * Fetch multiple movie poster infos in small batches.
 *
 * - **Does**: Processes IDs in batches to avoid spiking TMDB; adds a short delay between batches.
 * - **Takes**: `movieIds` (array of TMDB movie IDs).
 * - **Returns**: `Map<string, TMDBMoviePoster>` where key is `movieId`. Missing/failed IDs are omitted.
 */
export async function getMultipleMoviePosterInfo(movieIds: string[]): Promise<Map<string, TMDBMoviePoster>> {
  const uniqueMovieIds = [...new Set(movieIds)]
  const moviePosterMap = new Map<string, TMDBMoviePoster>()
  await Promise.all(
    uniqueMovieIds.map(async (id) => {
      const info = await getMoviePosterInfo(id)
      if (info) moviePosterMap.set(id, info)
    })
  )
  return moviePosterMap
}

/**
 * Fetch multiple TV series poster infos in small batches.
 *
 * - **Does**: Processes IDs in batches to avoid spiking TMDB; adds a short delay between batches.
 * - **Takes**: `seriesIds` (array of TMDB TV series IDs).
 * - **Returns**: `Map<string, TMDBTVSeriesPoster>` where key is `seriesId`. Missing/failed IDs are omitted.
 *
 */
export async function getMultipleTVSeriesPosterInfo(seriesIds: string[]): Promise<Map<string, TMDBTVSeriesPoster>> {
  const uniqueSeriesIds = [...new Set(seriesIds)]
  const seriesPosterMap = new Map<string, TMDBTVSeriesPoster>()
  await Promise.all(
    uniqueSeriesIds.map(async (id) => {
      const info = await getTVSeriesPosterInfo(id)
      if (info) seriesPosterMap.set(id, info)
    })
  )
  return seriesPosterMap
}
