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

// Shared detailed types used by components
export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country?: string
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

export interface MovieDetails {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: unknown
  budget: number
  genres: Genre[]
  homepage: string
  id: number
  imdb_id: string | null
  origin_country?: string[]
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