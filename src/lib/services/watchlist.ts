import prisma from '@/lib/config/prisma'

export interface WatchlistItem {
  contentId: string
  createdAt: string
  movie: {
    id: string
    type: string
    posterPath: string | null
  }
  displayTitle: string
  year: number | null
  href: string
}

type DbWatchlistItem = {
  contentId: string
  createdAt: Date
  movie: {
    id: string
    type: string
    posterPath: string | null
  }
}

type TmdbMovieResponse = {
  title?: string
  name?: string
  release_date?: string
  first_air_date?: string
  poster_path?: string | null
} | null

export class WatchlistService {
  private static readonly TMDB_TOKEN = process.env.TMDB_TOKEN
  private static readonly TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

  static async getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
    const items = await prisma.watchlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        contentId: true,
        createdAt: true,
        movie: {
          select: { id: true, type: true, posterPath: true },
        },
      },
    })

    return this.enrichItems(items)
  }

  private static async enrichItems(items: DbWatchlistItem[]): Promise<WatchlistItem[]> {
    if (!this.TMDB_TOKEN) {
      return this.createBasicItems(items)
    }

    const enrichedItems: WatchlistItem[] = []

    await Promise.all(
      items.map(async (item) => {
        const enriched = await this.enrichSingleItem(item)
        enrichedItems.push(enriched)
      })
    )

    return enrichedItems
  }

  private static async enrichSingleItem(item: DbWatchlistItem): Promise<WatchlistItem> {
    let displayTitle = item.movie.id
    let year: number | null = null

    try {
      const tmdbData = await this.fetchTmdbData(item.movie.id, item.movie.type)
      if (tmdbData) {
        displayTitle = tmdbData.title || tmdbData.name || item.movie.id
        year = this.extractYear(tmdbData.release_date || tmdbData.first_air_date)

        if (!item.movie.posterPath && tmdbData.poster_path) {
          await this.updatePosterPath(item.movie.id, tmdbData.poster_path)
          item.movie.posterPath = tmdbData.poster_path
        }
      }
    } catch {
      // Fallback to basic data
    }

    return {
      contentId: item.contentId,
      createdAt: item.createdAt.toISOString(),
      movie: item.movie,
      displayTitle,
      year,
      href: this.buildHref(item.movie.type, item.contentId),
    }
  }

  private static async fetchTmdbData(id: string, type: string): Promise<TmdbMovieResponse> {
    const endpoint = type === 'tv_series'
      ? `${this.TMDB_BASE_URL}/tv/${id}?language=hi-IN`
      : `${this.TMDB_BASE_URL}/movie/${id}?language=hi-IN`

    const response = await fetch(endpoint, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.TMDB_TOKEN}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) return null
    return response.json()
  }

  private static extractYear(dateStr?: string): number | null {
    return dateStr ? new Date(dateStr).getFullYear() : null
  }

  private static async updatePosterPath(id: string, posterPath: string) {
    await prisma.movie.update({
      where: { id },
      data: { posterPath },
    })
  }

  private static buildHref(type: string, contentId: string): string {
    return type === 'tv_series' ? `/web-series/${contentId}` : `/movie/${contentId}`
  }

  private static createBasicItems(items: DbWatchlistItem[]): WatchlistItem[] {
    return items.map(item => ({
      contentId: item.contentId,
      createdAt: item.createdAt.toISOString(),
      movie: item.movie,
      displayTitle: item.movie.id,
      year: null,
      href: this.buildHref(item.movie.type, item.contentId),
    }))
  }
}
