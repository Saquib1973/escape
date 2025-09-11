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