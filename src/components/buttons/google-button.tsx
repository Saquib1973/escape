'use client'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

export function GoogleButton() {
  return (
    <button
      onClick={() => signIn('google', { callbackUrl: "/" })}
      className="bg-dark-gray text-gray-300 flex gap-2 py-3 cursor-pointer p-2 w-full justify-center items-center"
    >
      <Image alt="google" height={28} width={28} className='size-5' src={'/google.png'} />
      Continue with Google
    </button>
  )
}
