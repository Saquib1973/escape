import { prisma } from '@/lib'

export async function searchUsers(query: string, currentUserId: string) {
  const q = query.trim()
  if (!q) return []

  return prisma.user.findMany({
    where: {
      id: { not: currentUserId },
      OR: [
        { username: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, username: true, name: true, image: true },
    take: 10,
    orderBy: { username: 'asc' },
  })
}

export async function isUsernameAvailable(username: string) {
  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })
  return !existing
}

export async function updateUsername(userId: string, username: string) {
  const normalized = username.trim().toLowerCase()
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  if (!usernameRegex.test(normalized)) {
    throw new Error(
      'Username must be 3-20 chars: letters, numbers, underscores, hyphens'
    )
  }

  const available = await isUsernameAvailable(normalized)
  if (!available) {
    throw new Error('Username is already taken')
  }

  return prisma.user.update({
    where: { id: userId },
    data: { username: normalized },
    select: { id: true, username: true, name: true, image: true },
  })
}
