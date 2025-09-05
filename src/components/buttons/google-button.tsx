'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function GoogleButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => signIn('google', { callbackUrl: "/" })}
      className="bg-dark-gray text-gray-300 flex gap-1 py-4 cursor-pointer p-2 w-full justify-center items-center rounded"
    >
      <Image alt="google" height={32} width={32} src={'/google.png'} />
      Sign in with Google
    </button>
  )
}
