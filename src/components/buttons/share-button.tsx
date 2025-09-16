'use client'

import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonProps {
  className?: string
}

const ShareButton: React.FC<ShareButtonProps> = ({ className = '' }) => {
  const [copied, setCopied] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const handleShare = async () => {
    const urlToShare = typeof window !== 'undefined' ? window.location.href : ''

    try {
      await navigator.clipboard.writeText(urlToShare)
      setShouldAnimate(true)
      setCopied(true)

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = urlToShare
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShouldAnimate(true)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center w-full gap-3 px-3 py-2 text-sm transition-colors ${className} ${
        copied
          ? 'text-light-green'
          : 'text-gray-300 hover:bg-dark-gray-hover hover:text-white'
      }`}
      title="Share URL"
    >
      <Share2 className="size-4" />
      <motion.span
        key={copied ? 'copied' : 'share'}
        initial={shouldAnimate ? { x: 20, opacity: 0 } : { x: 0, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        exit={shouldAnimate ? { x: -20, opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {copied ? 'Copied!' : 'Share'}
      </motion.span>
    </button>
  )
}

export default ShareButton
