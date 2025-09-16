'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '../loader'

export function SignInForm() {
  // states
  const [loading, setLoading] = useState(false)
  const [loadingAsGuest, setLoadingAsGuest] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // form submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')
    setLoading(true)
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
      router.push('/')
    }
  }

  const handleGuestLogin = async () => {
    setError('')
    setLoadingAsGuest(true)
    const result = await signIn('credentials', {
      redirect: false,
      email: 'guest@welcome.com',
      password: 'guest@welcome.com',
    })

    if (result?.error) {
      setError(result.error)
      setLoadingAsGuest(false)
    } else {
      setLoadingAsGuest(false)
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      <input
        disabled={loading}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="auth-form-input"
      />
      <input
        disabled={loading}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="auth-form-input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-light-green mt-2 text-white cursor-pointer p-2 w-full"
      >
        {!loading ? (
          'Sign In'
        ) : (
          <Loader color="#ffffff" className="" size="sm" />
        )}
      </button>
      <button
        type="button"
        onClick={handleGuestLogin}
        className="bg-dark-gray-2 text-white cursor-pointer p-2 w-full"
        >
        {!loadingAsGuest ? (
          "Login as guest"
        ) : (
          <Loader color="#ffffff" className="" size="sm" />
        )}
      </button>
    </form>
  )
}
