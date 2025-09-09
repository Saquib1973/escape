'use client'

import { useState, useEffect } from 'react'

export const useCurrentUrl = () => {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  return currentUrl
}
