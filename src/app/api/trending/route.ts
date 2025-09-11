import { NextResponse } from 'next/server'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const timeWindow = searchParams.get('time_window') || 'day' // 'day' | 'week'

    const url = `${TMDB_BASE_URL}/trending/all/${timeWindow}?language=en-US&page=${page}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN}` as string,
      },
      // Revalidate quickly to keep data fresh but cacheable on the server
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        { error: 'Failed to fetch trending from TMDB', details: text },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, {
      status: 200,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Unexpected error fetching trending', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}


