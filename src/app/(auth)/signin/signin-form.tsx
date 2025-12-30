'use client'

import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Loader from '@/components/ui/loader'
import { AnimatePresence, motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGuestLoading, setIsGuestLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== ''
  const isAnyLoading = isLoading || isGuestLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid || isAnyLoading) return

    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    if (isAnyLoading) return

    setError('')
    setIsGuestLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: 'guest@escape.com',
        password: 'guest',
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsGuestLoading(false)
    }
  }

  useEffect(() => {
    if (!error) return

    const timer = setTimeout(() => {
      setError('')
    }, 10000)

    return () => clearTimeout(timer)
  }, [error])

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      <Input
        disabled={isAnyLoading}
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
        variant="primary"
      />
      <Input
        disabled={isAnyLoading}
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
        className={`mt-2 ${error ? "bg-red-500" : ""}`}
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
              key="signin"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Sign In
            </motion.p>
          )}
        </AnimatePresence>
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={isAnyLoading}
        onClick={handleGuestLogin}
      >
        {isGuestLoading ? (
          <Loader color="#ffffff" size="sm" />
        ) : (
          'Login as guest'
        )}
      </Button>
    </form>
  )
}
