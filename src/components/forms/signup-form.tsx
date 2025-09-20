'use client'

import { signup } from '@/app/(auth)/signup/actions'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '../loader'
import Input from '../input'

export function SignUpForm() {
  //states
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const router = useRouter()

  // function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')
    setIsLoading(true)

    try {
      const result = await signup(data)

      if (result?.success) {
        const loginResult = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
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

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      <Input
        disabled={isLoading}
        type="text"
        value={data.name}
        onChange={(e) => setData({...data, name:e.target.value})}
        placeholder="Name"
        required
        variant='primary'
      />
      <Input
        disabled={isLoading}
        type="email"
        value={data.email}
        onChange={(e) => setData({...data, email:e.target.value})}
        placeholder="Email"
        required
        variant='primary'
      />
      <Input
        disabled={isLoading}
        type="password"
        value={data.password}
        onChange={(e) => setData({...data, password:e.target.value})}
        placeholder="Password"
        required
        variant='primary'
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-light-green my-2 text-white cursor-pointer p-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {!isLoading ? (
          'Sign Up'
        ) : (
          <Loader color="#ffffff" className="" size="sm" />
        )}
      </button>
    </form>
  )
}
