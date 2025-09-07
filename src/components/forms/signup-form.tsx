'use client'

import { signup } from '@/app/(auth)/signup/actions'
import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import Loader from '../loader'

export function SignUpForm() {
  //states
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
  const [usernameRecommendations, setUsernameRecommendations] = useState<string[]>([])
  const [hasShownRecommendations, setHasShownRecommendations] = useState(false)

  const debouncedUsername = useDebounce(username, 500)

  // Fetch username recommendations
  const fetchUsernameRecommendations = async () => {
    try {
      const recommendationsResponse = await fetch('/api/auth/username?count=5')
      const recommendationsData = await recommendationsResponse.json()

      if (recommendationsData.success) {
        setUsernameRecommendations(recommendationsData.usernames)
        setHasShownRecommendations(true)
      }
    } catch (err) {
      console.error('Failed to fetch username recommendations:', err)
    }
  }

  // Check username availability
  const checkUsernameAvailability = useCallback(async () => {
    if (!debouncedUsername || debouncedUsername.length < 3) {
      setUsernameStatus('idle')
      setUsernameRecommendations([])
      setHasShownRecommendations(false)
      return
    }

    setUsernameStatus('checking')

    try {
      const response = await fetch('/api/auth/username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: debouncedUsername }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.available) {
          setUsernameStatus('available')
          setUsernameRecommendations([])
          setHasShownRecommendations(false)
        } else {
          setUsernameStatus('unavailable')

          // Only fetch recommendations once when username becomes unavailable
          if (!hasShownRecommendations) {
            await fetchUsernameRecommendations()
          }
        }
      } else {
        setUsernameStatus('idle')
      }
    } catch (err) {
      console.error('Failed to check username availability:', err)
      setUsernameStatus('idle')
    }
  }, [debouncedUsername, hasShownRecommendations])

  // Check username availability when debounced username changes
  useEffect(() => {
    checkUsernameAvailability()
  }, [checkUsernameAvailability])

  // Handle username input change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)

    // Reset recommendations flag when user starts typing a new username
    if (hasShownRecommendations) {
      setHasShownRecommendations(false)
      setUsernameRecommendations([])
    }
  }

  // Handle recommendation click
  const handleRecommendationClick = (recommendedUsername: string) => {
    setUsername(recommendedUsername)
    setUsernameRecommendations([])
    setHasShownRecommendations(true)
  }

  // function to handle form submission
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
        className="auth-form-input"
      />
      <div className="relative">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={username}
          onChange={handleUsernameChange}
          className="auth-form-input"
        />

        {/* Username status indicator */}
        {usernameStatus === 'checking' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader size="sm" />
          </div>
        )}

        {usernameStatus === 'available' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {usernameStatus === 'unavailable' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <p className="text-red-500 text-xs text-end">
              Username already exists
            </p>
          </div>
        )}
      </div>

      {usernameStatus === 'unavailable' &&
        usernameRecommendations.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {usernameRecommendations.map((recommendedUsername) => (
                <button
                  key={recommendedUsername}
                  type="button"
                  onClick={() => handleRecommendationClick(recommendedUsername)}
                  className="px-3 py-1 text-sm bg-dark-gray transition-colors"
                >
                  {recommendedUsername}
                </button>
              ))}
            </div>
          </div>
        )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="auth-form-input"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="auth-form-input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-light-green my-2 text-white p-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
}
