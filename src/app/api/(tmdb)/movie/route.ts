import { NextResponse } from 'next/server'

const token = process.env.TMDB_TOKEN
const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('id') || undefined
    if (!movieId || typeof movieId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing movie id' },
        { status: 400 }
      )
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Server misconfiguration: TMDB_TOKEN is not set' },
        { status: 500 }
      )
    }

    const url = `${baseUrl}/movie/${movieId}?language=hi-IN`
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return NextResponse.json(
        { error: 'Failed to fetch movie details', details: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Unexpected error fetching movie details',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
