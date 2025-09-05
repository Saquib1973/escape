const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWUyYjQxN2E1YTBlMmVjODMxMWI5MmI2MDFlNTc0NyIsIm5iZiI6MTc1NTIwOTI1Mi42MDYwMDAyLCJzdWIiOiI2ODllNWUyNGEyOTE4ZDdkZWM4ZGJmMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6j_ocxIEWOsbgjBG_eYv80kApJeZvlX2aEOCK2Roctk'

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  first_air_date: string
  vote_average: number
}

export interface TMDBResponse<T> {
  results: T[]
  total_pages: number
  total_results: number
  page: number
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return []

  try {
    const url = `${TMDB_BASE_URL}/search/movie?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(query)}`
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

    const data: TMDBResponse<Movie> = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

export async function searchTVShows(query: string): Promise<TVShow[]> {
  if (!query.trim()) return []

  try {
    const url = `${TMDB_BASE_URL}/search/tv?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(query)}`
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

    const data: TMDBResponse<TVShow> = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error searching TV shows:', error)
    return []
  }
}
