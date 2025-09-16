import { NextResponse } from 'next/server'
import axios from 'axios'

const token = process.env.TMDB_TOKEN
const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

export async function GET() {
  if (!token) {
    return NextResponse.json(
      { error: 'Server misconfiguration: TMDB_TOKEN is not set' },
      { status: 500 }
    )
  }

  try {
    const url = `${baseUrl}/movie/now_playing?language=hi-IN&page=1&region=IN`
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data, { status: 200 })
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          error: 'Failed to fetch now playing from TMDB',
          details: error.response.data,
        },
        { status: error.response.status }
      )
    }

    return NextResponse.json(
      {
        error: 'Unexpected error fetching now playing',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}