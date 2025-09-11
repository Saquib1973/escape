import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('id')
    const page = searchParams.get('page') || '1'

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    const token = process.env.TMDB_TOKEN
    const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

    if (!token) {
      return NextResponse.json(
        { error: 'Server misconfiguration: TMDB_TOKEN is not set' },
        { status: 500 }
      )
    }

    const url = `${baseUrl}/movie/${movieId}/recommendations?language=en-US&page=${page}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      let details: unknown
      try {
        details = await response.json()
      } catch {
        details = await response.text()
      }
      return NextResponse.json(
        { error: 'Failed to fetch movie recommendations from TMDB', details },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Unexpected error fetching movie recommendations', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
