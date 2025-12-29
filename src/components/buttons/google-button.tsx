'use client'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import Loader from '../ui/loader'

export function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Google sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="bg-dark-gray text-gray-300 flex gap-2 py-3 cursor-pointer p-2 w-full justify-center items-center disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Image
        alt="google"
        height={28}
        width={28}
        className="size-5"
        src={'/google.png'}
      />
      {!isLoading ? (
        <p>Continue with Google</p>
      ) : (
        <Loader color="#ffffff" className="" size="sm" />
      )}
    </button>
  )
}
