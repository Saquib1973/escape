'use server'
import { prisma } from '@/lib'

export interface SearchUserResult {
  id: string
  name: string | null
  email: string | null
  image: string
  username: string | null
}

export async function searchUsers(query: string): Promise<SearchUserResult[]> {
  if (!query.trim()) {
    return []
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false, // Exclude soft deleted users
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
        username:true,
      },
      take: 20,
    })
    return users as SearchUserResult[]
  } catch (error) {
    console.error('Error searching users: ', error)
    return []
  }
}
