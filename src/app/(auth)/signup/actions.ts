'use server'

import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function signup(formData: FormData) {
  const name = formData.get('name') as string
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
      },
    })
  } catch (error) {
    console.log('Error : ', error)
    return
  }

  redirect('/signin')
}
