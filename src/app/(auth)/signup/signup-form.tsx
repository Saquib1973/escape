'use client'

import { signup } from '@/app/(auth)/signup/actions'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Loader from '@/components/ui/loader'
import { AnimatePresence, motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SignUpForm() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const router = useRouter()

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== ''

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isFormValid || isLoading) return

    setError('')
    setIsLoading(true)

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
          router.push('/')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
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
        disabled={!isFormValid || isLoading}
        className={`mt-2 h-10 ${error ? "bg-red-500" : ""}`}
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
  )
}
