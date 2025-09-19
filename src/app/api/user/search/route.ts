import { NextRequest, NextResponse } from 'next/server'
import { searchUsers } from '@/lib/services/user'
import { UnauthorizedError, getUserId } from '@/lib/services/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId()
    const query = req.nextUrl.searchParams.get('query') || ''
    const users = await searchUsers(query, userId)
    return NextResponse.json(users)
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
