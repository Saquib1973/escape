'use server'
import prisma from '@/lib/prisma'

export interface SearchUserResult {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

export async function searchUsers(query: string): Promise<SearchUserResult[]> {
  if (!query.trim()) {
    return []
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 20,
    })
    return users
  } catch (error) {
    console.error('Error searching users: ', error)
    return []
  }
}
