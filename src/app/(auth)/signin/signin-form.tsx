'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/loader'
import Input from '@/components/ui/input'

export function SignInForm() {
  // states
  const [status, setStatus] = useState({
    guestLogin: false,
    login: false,
  })

  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  // form submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')
    setStatus({ ...status, login: true })
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    })

    if (result?.error) {
      setError(result.error)
      setStatus({ ...status, login: false })
    } else {
      setStatus({ ...status, login: false })
      router.push('/')
    }
  }
  const handleGuestLogin = async () => {
    setError('')
    setStatus({ ...status, guestLogin: true })
    const result = await signIn('credentials', {
      redirect: false,
      email: 'guest@escape.com',
      password: 'guest',
    })

    if (result?.error) {
      setError(result.error)
      setStatus({ ...status, guestLogin: false })
    } else {
      setStatus({ ...status, guestLogin: false })
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      <Input
        disabled={status.login}
        type="email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        placeholder="Email"
        required
        variant="primary"
      />
      <Input
        disabled={status.login}
        type="password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        placeholder="Password"
        required
        variant="primary"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-light-green mt-2 text-white cursor-pointer p-2 w-full"
      >
        {!status.login ? (
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
        {!status.guestLogin ? (
          'Login as guest'
        ) : (
          <Loader color="#ffffff" className="" size="sm" />
        )}
      </button>
    </form>
  )
}
