'use client'

import { signup } from '@/app/(auth)/signup/actions'
import { useState } from 'react'

export function SignUpForm() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await signup(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        className="input"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="input"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-light-green text-lg text-white rounded p-4 w-full disabled:opacity-50"
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
}
