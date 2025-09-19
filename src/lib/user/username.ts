import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

export const UsernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores, and hyphens allowed')


export function generateRandomUsername(count: number = 10): string[] {
  const usernames: string[] = []
  const used = new Set<string>()

  while (usernames.length < count) {
    const timePart = Date.now().toString(36)
    const randPart = Math.random().toString(36).slice(2, 8)
    const suffix = (timePart + randPart).slice(-8)
    const username = `user${suffix}`
    if (!used.has(username)) {
      used.add(username)
      usernames.push(username)
    }
  }

  return usernames
}

// Single public API: generate a deterministic username from email and ensure uniqueness

export async function generateUniqueUsernameFromEmail(email: string, prisma: PrismaClient): Promise<string> {
  const emailPrefix = email.split('@')[0]

  const cleanPrefix = emailPrefix
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')

  const base = (cleanPrefix.length >= 3 ? cleanPrefix : 'user').slice(0, 20)

  // Try the base first
  const existingBase = await prisma.user.findUnique({
    where: {
      username: base,
      isDeleted: true,
    },
    select: { username: true }
  })
  if (!existingBase) return base

  // Then append small numeric suffixes while respecting 20-char max
  for (let suffixNumber = 1; suffixNumber <= 100; suffixNumber++) {
    const suffix = String(suffixNumber)
    const trimmedBase = base.slice(0, 20 - suffix.length)
    const candidate = `${trimmedBase}${suffix}`

    const existing = await prisma.user.findUnique({
      where: {
        username: candidate,
        isDeleted: false, // Exclude soft deleted users
      },
      select: { username: true }
    })
    if (!existing) return candidate
  }

  // Fallback: short deterministic-ish suffix based on time
  const timeSuffix = Date.now().toString(36).slice(-4)
  const fallbackBase = base.slice(0, 20 - timeSuffix.length)
  return `${fallbackBase}${timeSuffix}`
}

// Removed async random generator in favor of using generateUsernameCombinations + availability checks