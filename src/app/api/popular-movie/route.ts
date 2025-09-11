import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const token = process.env.TMDB_TOKEN
    const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

    if (!token) {
      return NextResponse.json(
        { error: 'Server misconfiguration: TMDB_TOKEN is not set' },
        { status: 500 }
      )
    }

    const url = `${baseUrl}/movie/popular?language=en-US&page=1&region=IN`
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
        { error: 'Failed to fetch popular movies from TMDB', details },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Unexpected error fetching popular movies', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}


