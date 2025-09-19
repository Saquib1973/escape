import { getUserId, UnauthorizedError } from '@/lib/services/auth'
import { updateUsername } from '@/lib/services/user'
import { UsernameSchema } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId()
    const body = await req.json()
    const parsed = UsernameSchema.safeParse(body?.username)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid username' },
        { status: 400 }
      )
    }

    const normalized = parsed.data
    const user = await updateUsername(userId, normalized)
    return NextResponse.json({ success: true, user })
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    const status = message.toLowerCase().includes('taken') ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
