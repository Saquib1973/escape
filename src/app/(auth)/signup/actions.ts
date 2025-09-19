'use server'

import { generateUniqueUsernameFromEmail, prisma } from '@/lib'
import bcrypt from 'bcryptjs'

interface SignupData{
  name: string
  password: string
  email:string
}

export async function signup(data: SignupData) {
  const { name, password, email } = data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
      isDeleted: false, // Only check non-deleted users
    }
  })
  if (existingUser) {
    throw new Error('User already exists')
  }

  const username = await generateUniqueUsernameFromEmail(email, prisma)

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        image: 'https://api.dicebear.com/9.x/lorelei/svg?seed=' + username,
      },
    })

    return { success: true, email }
  } catch (error) {
    console.log('Error : ', error)
    throw new Error('Failed to create user')
  }
}
