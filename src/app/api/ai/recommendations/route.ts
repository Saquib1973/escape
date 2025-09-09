import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type RecommendationInput = {
  contextType?: 'movie' | 'tv'
  contextId?: string
  likedMovies?: string[]
  likedTV?: string[]
}

type NormalizedRecommendation = {
  type: 'movie' | 'tv'
  id: string
  title: string
}

function buildPrompt(input: RecommendationInput): string {
  const likedMovies =
    input.likedMovies && input.likedMovies.length > 0
      ? `Movies liked: ${input.likedMovies.join(', ')}`
      : ''
  const likedTV =
    input.likedTV && input.likedTV.length > 0
      ? `TV liked: ${input.likedTV.join(', ')}`
      : ''
  const ctx =
    input.contextType && input.contextId
      ? `Currently viewing ${input.contextType} with TMDB id ${input.contextId}.`
      : ''
  const wants =
    'Recommend a concise mixed list of movies and TV series the user is likely to enjoy.'
  const constraints =
    'Return JSON with an array under key "items", each item: {"type":"movie"|"tv","id":TMDB_id_string,"title":string}. No extra text.'
  return [wants, ctx, likedMovies, likedTV, constraints].filter(Boolean).join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RecommendationInput
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 })
    }

    const prompt = buildPrompt(body)

    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
      encodeURIComponent(apiKey)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    let resp: Response
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 512,
            responseMimeType: 'application/json'
          }
        }),
        signal: controller.signal
      })
    } catch (err) {
      clearTimeout(timeout)
      const message = err instanceof Error ? err.message : String(err)
      return NextResponse.json(
        { error: 'Upstream fetch failed', details: message },
        { status: 502 }
      )
    } finally {
      clearTimeout(timeout)
    }

    if (!resp.ok) {
      const text = await resp.text()
      console.error('Gemini upstream error:', resp.status, text)
      return NextResponse.json(
        { error: 'Gemini error', status: resp.status, details: text },
        { status: resp.status }
      )
    }

    const data: unknown = await resp.json().catch(() => null as unknown)

    // Try multiple extraction strategies depending on model response shape
    let rawText: string = ''
    try {
      type GeminiResponse = {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> }
        }>
      }
      const asGemini = data as GeminiResponse
      rawText = asGemini?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    } catch {}

    if (rawText && rawText.trim().startsWith('```')) {
      const first = rawText.indexOf('```')
      const last = rawText.lastIndexOf('```')
      if (last > first) rawText = rawText.slice(first + 3, last)
    }

    if (!rawText || rawText.trim() === '') {
      try {
        rawText = JSON.stringify(data)
      } catch {
        rawText = ''
      }
    }

    let items: NormalizedRecommendation[] = []
    try {
      const parsed: unknown = JSON.parse(rawText)
      const parsedObj = parsed as { items?: unknown }
      const raw = Array.isArray(parsedObj.items) ? (parsedObj.items as unknown[]) : []
      items = raw
        .map((r: unknown): NormalizedRecommendation => {
          const rec = r as Record<string, unknown>
          const type: 'movie' | 'tv' = rec?.type === 'tv' ? 'tv' : 'movie'
          const idVal = rec['id']
          const titleVal = rec['title']
          const id = typeof idVal === 'string' || typeof idVal === 'number' ? String(idVal) : ''
          const title = typeof titleVal === 'string' ? titleVal : ''
          return { type, id, title }
        })
        .filter((r: NormalizedRecommendation) => Boolean(r.id && r.title))
    } catch {
      try {
        const start = rawText.indexOf('{')
        const end = rawText.lastIndexOf('}')
        if (start !== -1 && end !== -1) {
          const parsed: unknown = JSON.parse(rawText.slice(start, end + 1))
          const parsedObj = parsed as { items?: unknown }
          const raw = Array.isArray(parsedObj.items) ? (parsedObj.items as unknown[]) : []
          items = raw
            .map((r: unknown): NormalizedRecommendation => {
              const rec = r as Record<string, unknown>
              const type: 'movie' | 'tv' = rec?.type === 'tv' ? 'tv' : 'movie'
              const idVal = rec['id']
              const titleVal = rec['title']
              const id = typeof idVal === 'string' || typeof idVal === 'number' ? String(idVal) : ''
              const title = typeof titleVal === 'string' ? titleVal : ''
              return { type, id, title }
            })
            .filter((r: NormalizedRecommendation) => Boolean(r.id && r.title))
        }
      } catch {
        items = []
      }
    }

    return NextResponse.json({ items })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 500 })
  }
}
