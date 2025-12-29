import { isUsernameAvailable } from '@/services/user'
import { prisma, generateRandomUsername, UsernameSchema } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const username = (searchParams.get('username') || '').trim()

  if (username) {
    const parsed = UsernameSchema.safeParse(username)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          available: false,
          username: username.toLowerCase(),
          error: parsed.error.issues[0]?.message || 'Invalid username',
        },
        { status: 400 }
      )
    }

    const normalized = parsed.data
    const available = await isUsernameAvailable(normalized)
    return NextResponse.json({
      success: true,
      username: normalized,
      available,
      message: available ? 'Username is available' : 'Username is taken',
    })
  }

  const limit = 10
  const candidates = generateRandomUsername(limit * 2)
  const existing = await prisma.user.findMany({
    where: {
      username: { in: candidates },
      isDeleted: false, // Exclude soft deleted users
    },
    select: { username: true },
  })
  const taken = new Set(existing.map((u) => u.username))
  const available: string[] = candidates.filter((u) => !taken.has(u))

  const suggestions = available.slice(0, limit)
  return NextResponse.json({ success: true, usernames: suggestions, count: suggestions.length })
}
