'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'

import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Loader from '@/components/ui/loader'
import { GoogleButton } from '@/components/buttons/google-button'
import AnimatePageWrapper from '@/components/animate-page-wrapper'
import { signup } from './actions'

// Validation
import { signupSchema, SignupInput } from '@/lib/validations/auth'

export default function SignUp() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SignupInput>({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isLoading) return
    setError('')

    // Validate form data
    const validationResult = signupSchema.safeParse(formData)
    if (!validationResult.success) {
      setError(validationResult.error.issues[0].message)
      return
    }

    setIsLoading(true)

    // Submit signup request
    try {
      const result = await signup(formData)

      if (result?.success) {
        const loginResult = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })

        if (loginResult?.error) {
          setError('Signup successful but login failed. Please try logging in manually.')
        } else {
          router.refresh()
          router.push('/')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-clear error after 10 seconds
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(''), 10000)
    return () => clearTimeout(timer)
  }, [error])

  return (
    <AnimatePageWrapper className="max-md:px-2 flex bg-light-gray text-gray-300 flex-col gap-2 items-center py-10 lg:py-32 min-h-screen">
      <div className="max-w-lg flex items-center justify-center flex-col gap-3 w-full">
        
        <div className="flex flex-col text-4xl py-2 gap-1 w-full font-light">
          <h1 className="">Join Us!</h1>
          <h1 className="">Create Your</h1>
          <h1 className="">Account</h1>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <Input
            disabled={isLoading}
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            required
            variant="primary"
          />
          <Input
            disabled={isLoading}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            required
            variant="primary"
          />
          <Input
            disabled={isLoading}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Password"
            required
            variant="primary"
          />
          
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className={`mt-2 h-10 ${error ? "bg-red-500 hover:bg-red-600" : ""}`}
            onMouseEnter={() => setError("")}
          >
            <AnimatePresence mode="wait">
              {error ? (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </motion.p>
              ) : isLoading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader color="#ffffff" size="sm" />
                </motion.div>
              ) : (
                <motion.p
                  key="signup"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  Sign Up
                </motion.p>
              )}
            </AnimatePresence>
          </Button>
        </form>
        
        <div className="">or</div>
        <GoogleButton />
        
        <div className="flex gap-1">
          <p>Already have an account?</p>
          <Link href={'/signin'} className="underline">
            Sign In
          </Link>
        </div>

      </div>
    </AnimatePageWrapper>
  )
}