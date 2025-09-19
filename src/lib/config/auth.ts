import { AuthOptions, getServerSession } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from './prisma'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import {
  generateUniqueUsernameFromEmail,
  generateRandomUsername,
} from '../user/username'

const customAdapter = {
  ...PrismaAdapter(prisma),
  async createUser(user: { id: string; name?: string | null; email?: string | null; emailVerified?: Date | null; image?: string | null; username?: string }) {
    let username = user.username
    if (!username && user.email) {
      username = await generateUniqueUsernameFromEmail(user.email, prisma)
    }

    if (!username) {
      // Generate few candidates and pick the first available using Prisma directly
      const candidates = generateRandomUsername()
      const existing = await prisma.user.findMany({
        where: { username: { in: candidates } },
        select: { username: true },
      })
      const taken = new Set(existing.map(u => u.username))
      username = candidates.find(u => !taken.has(u)) || `user${Date.now().toString(36).slice(-6)}`
    }

    return prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        username: username,
      },
    })
  },
}

export const authOptions: AuthOptions = {
  adapter: customAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user?.password) {
          throw new Error('Invalid credentials')
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || undefined,
          username: user.username || undefined,
          image: user.image || undefined,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT for sessions with credentials provider
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update every 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.username = user.username
        token.image = user.image ?? token.image ?? null
      } else if (token.id) {
        // Ensure image (and username) are present on token when missing
        const needsImage = token.image == null
        const needsUsername = !token.username
        if (needsImage || needsUsername) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { username: true, image: true },
          })
          if (needsUsername) {
            token.username = dbUser?.username
          }
          if (needsImage) {
            const dicebear = token.username
              ? `https://api.dicebear.com/9.x/lorelei/svg?seed=${token.username}`
              : null
            token.image = dbUser?.image ?? token.image ?? dicebear
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string | undefined
        session.user.username = token.username as string | undefined
        session.user.image = token.image ?? undefined
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export const getSession = async () => {
  const session = await getServerSession(authOptions)
  return session
}
