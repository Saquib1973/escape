import { PrismaClient } from '@prisma/client'

export const adjectives = [
  'mystic',
  'shadow',
  'phantom',
  'nebula',
  'titan',
  'iron',
  'fox',
  'lion',
  'falcon',
  'blade',
  'nomad',
  'maverick',
  'rogue',
  'viking',
  'storm',
  'blaze',
  'ranger',
  'striker',
  'glimmer',
  'softelm',
  'faint',
  'peachy',
  'ember',
  'drift',
  'horizon',
  'voyage',
  'rain',
  'cascade',
  'radiant',
  'arctic',
  'sentinel',
  'savage',
  'urban',
  'lynx',
  'samurai',
  'mars',
  'cosmic',
  'stellar',
  'lunar',
  'solar',
  'galactic',
  'celestial',
  'ethereal',
  'crimson',
  'azure',
  'golden',
  'silver',
  'bronze',
  'platinum',
  'diamond',
]

export const nouns = [
  'assassin',
  'user',
  'moon',
  'dust',
  'lavender',
  'twilight',
  'petal',
  'sync',
  'void',
  'wanderer',
  'ghost',
  'cloud',
  'berry',
  'midnight',
  'veil',
  'static',
  'serenity',
  'neutral',
  'aura',
  'tiny',
  'sugar',
  'lilac',
  'whisper',
  'minty',
  'cozy',
  'peach',
  'soft',
  'velvet',
  'sleepy',
  'sketch',
  'pink',
  'bloom',
  'sugarcove',
  'aurora',
  'queen',
  'rose',
  'crystal',
  'vibe',
  'noble',
  'phantom',
  'shadow',
  'nebula',
  'titan',
  'fox',
  'lion',
  'falcon',
  'blade',
  'nomad',
  'maverick',
  'rogue',
  'viking',
  'storm',
  'blaze',
  'ranger',
  'striker',
  'glimmer',
  'ember',
  'drift',
  'horizon',
  'voyage',
  'rain',
  'cascade',
  'radiant',
  'arctic',
  'sentinel',
  'savage',
  'urban',
  'lynx',
  'samurai',
  'mars',
  'cosmos',
  'star',
  'planet',
  'comet',
  'meteor',
  'asteroid',
]

export const connectingWords = [
  'and',
  'or',
  'of',
  'the',
  'in',
  'on',
  'at',
  'by',
  'for',
  'with',
  'from',
  'to',
  'under',
  'over',
  'through',
  'between',
  'among',
  'within',
  'without',
  'above',
  'below',
  'beside',
  'beyond',
  'across',
  'around',
  'near',
  'far',
  'inside',
  'outside',
]

export function generateUsernameCombinations(count: number = 10): string[] {
  const usernames: string[] = []
  const usedCombinations = new Set<string>()

  while (usernames.length < count && usedCombinations.size < 1000) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    const connectingWord =
      Math.random() < 0.3
        ? connectingWords[Math.floor(Math.random() * connectingWords.length)]
        : ''
    const number = generateRandomNumber()

    let username: string

    if (connectingWord) {
      username = `${adjective}${connectingWord}${noun}${number}`
    } else {
      username = `${adjective}${noun}${number}`
    }

    if (!usedCombinations.has(username)) {
      usedCombinations.add(username)
      usernames.push(username)
    }
  }

  return usernames
}
export function generateRandomNumber(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}


export function generateUsernameFromEmail(email: string): string {
  const emailPrefix = email.split('@')[0]

  const cleanPrefix = emailPrefix
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters

  const prefix = cleanPrefix.length >= 3 ? cleanPrefix : cleanPrefix + 'user'

  const randomNumber = generateRandomNumber()

  return `${prefix}${randomNumber}`
}

export async function generateUniqueUsernameFromEmail(email: string, prisma: PrismaClient): Promise<string> {
  const baseUsername = generateUsernameFromEmail(email)
  let username = baseUsername
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { username: true }
    })

    if (!existingUser) {
      return username
    }

    attempts++
    const newNumber = Math.floor(1000 + Math.random() * 9000).toString()
    username = `${baseUsername.slice(0, -4)}${newNumber}`
  }

  const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString()
  return `${baseUsername.slice(0, -4)}${randomSuffix}`
}

export async function generateRandomUsername(prisma: PrismaClient): Promise<string> {
  const adjectives = ['mystic', 'shadow', 'phantom', 'nebula', 'titan', 'fox', 'lion', 'falcon', 'blade', 'nomad']
  const nouns = ['user', 'moon', 'dust', 'ghost', 'cloud', 'star', 'planet', 'comet', 'meteor', 'asteroid']

  let attempts = 0
  const maxAttempts = 20

  while (attempts < maxAttempts) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    const number = Math.floor(1000 + Math.random() * 9000).toString()
    const username = `${adjective}${noun}${number}`

    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { username: true }
    })

    if (!existingUser) {
      return username
    }

    attempts++
  }

  const timestamp = Date.now().toString().slice(-6)
  return `user${timestamp}`
}