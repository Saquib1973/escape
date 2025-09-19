import { getSession } from '@/lib/config/auth'

export class UnauthorizedError extends Error {}

export async function getUserId() {
  const session = await getSession()
  const userId = session?.user?.id
  if (!userId) throw new UnauthorizedError('Unauthorized')
  return userId
}
