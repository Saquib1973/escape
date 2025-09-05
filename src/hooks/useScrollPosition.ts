import { useState, useEffect } from 'react'

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset)
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('scroll', updatePosition)
    updatePosition() // Set initial values

    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return { scrollPosition, windowHeight }
}
