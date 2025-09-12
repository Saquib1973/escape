import { NextResponse } from 'next/server'
import { http } from '@/lib/http'
import prisma from '@/lib/prisma'
import { TMDBMovieDetails } from '@/types/tmdb'

const token = process.env.TMDB_TOKEN
const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const seriesId = searchParams.get('id') || undefined
    if (!seriesId || typeof seriesId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing series id' },
        { status: 400 }
      )
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Server misconfiguration: TMDB_TOKEN is not set' },
        { status: 500 }
      )
    }

    const url = `${baseUrl}/tv/${seriesId}?language=en-US`
    const response = await http.getWithRetry<TMDBMovieDetails>(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const posterPath = response.data?.poster_path ?? null
    // Upsert series row and cache posterPath
    try {
      await prisma.movie.upsert({
        where: { id: seriesId },
        update: { posterPath },
        create: { id: seriesId, type: 'tv_series', posterPath },
      })
    } catch (dbError) {
      console.error('Failed to upsert series row:', dbError)
    }

    return NextResponse.json(response.data, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Unexpected error fetching series details',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}


