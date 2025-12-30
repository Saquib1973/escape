'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import Button from '../ui/button'
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
    <Button
      variant='secondary-light'
      className='gap-2 h-11'
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <Image
        alt="google"
        height={28}
        width={28}
        className="size-5"
        src={'/google.png'}
      />
      <AnimatePresence mode='wait'>

        {!isLoading ? (
          <motion.p
            key="continue"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Continue with Google
          </motion.p>
        ) : (
          <motion.span
            key="loading"
            className='gap-2 flex items-center justify-center'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Loading accounts...
            <Loader color="#ffffff" className="" size="sm" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
