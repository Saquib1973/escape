'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'

import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Loader from '@/components/ui/loader'
import { GoogleButton } from '@/components/buttons/google-button'
import AnimatePageWrapper from '@/components/animate-page-wrapper'
import { loginSchema, LoginInput } from '@/lib/validations/auth'

const GUEST_CREDS = { email: 'guest@escape.com', password: 'guest' }

export default function SignIn() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginInput>({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loadingType, setLoadingType] = useState<'user' | 'guest' | null>(null)

  const isLoading = loadingType !== null

  const handleLogin = async (creds: LoginInput, type: 'user' | 'guest') => {
    // Reset error and set loading type
    setError('')
    setLoadingType(type)

    // Validate user credentials
    if (type === 'user') {
      const result = loginSchema.safeParse(creds)
      if (!result.success) {
        setError(result.error.issues[0].message)
        setLoadingType(null)
        return
      }
    }

    // Attempt to sign in
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: creds.email,
        password: creds.password,
      })

      if (res?.error) {
        setError('Invalid email or password')
      } else {
        router.refresh()
        router.push('/')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoadingType(null)
    }
  }

  return (
    <AnimatePageWrapper className="max-md:px-2 flex bg-light-gray text-gray-300 flex-col gap-2 items-center py-10 lg:py-32 min-h-screen">
      <div className="max-w-lg flex items-center justify-center flex-col gap-3 w-full">
        <div className="flex flex-col text-4xl py-2 gap-1 w-full font-light">
          <h1 className="">Hello Again!</h1>
          <h1 className="">Welcome</h1>
          <h1 className="">back</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleLogin(formData, 'user')
          }}
          className="w-full flex flex-col gap-2"
        >
          <Input
            disabled={isLoading}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            placeholder="Email"
            required
            variant="primary"
          />

          <Input
            disabled={isLoading}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
            placeholder="Password"
            required
            variant="primary"
          />

          <Button
            type="submit"
            variant="primary"
            className={`mt-2 ${error ? 'bg-red-500 hover:bg-red-600' : ''}`}
            disabled={isLoading}
            onMouseEnter={() => setError('')}
          >
            <AnimatePresence mode="wait">
              {error ? (
                <motion.span
                  key="error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.span>
              ) : loadingType === 'user' ? (
                <Loader color="#ffffff" size="sm" />
              ) : (
                <span>Sign In</span>
              )}
            </AnimatePresence>
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={() => handleLogin(GUEST_CREDS, 'guest')}
          >
            {loadingType === 'guest' ? <Loader color="#ffffff" size="sm" /> : 'Login as guest'}
          </Button>
        </form>

        <div className="">or</div>
        <GoogleButton />

        <div className="flex gap-1">
          <p>Don&apos;t have an account?</p>
          <Link href={'/signup'} className="underline">
            Register
          </Link>
        </div>
      </div>
    </AnimatePageWrapper>
  )
}