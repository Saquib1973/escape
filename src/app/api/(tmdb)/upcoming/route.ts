import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const language = searchParams.get('language') || 'en-US'

    const url = `${process.env.TMDB_BASE_URL}/movie/upcoming?language=${language}&page=${page}`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Upcoming movies API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming movies' },
      { status: 500 }
    )
  }
}
