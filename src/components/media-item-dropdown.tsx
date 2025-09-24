'use client'

import { Bookmark, Bug, Calendar, MoreVertical, Plus, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LogWatchingForm from './forms/log-watching-form'
import { CreatePostForm } from './forms/create-post-form'
import ShareButton from './buttons/share-button'

/**
 * MediaItemDropdown - A reusable dropdown component for media items
 *
 * Features:
 * - Three-dot menu that appears on hover
 * - Create Post functionality
 * - Log Watching functionality with date selection
 * - Add/Remove from Watchlist functionality
 * - Share functionality (copies URL to clipboard)
 * - Report functionality
 * - Consistent styling with the rest of the app
 *
 * Usage:
 * <MediaItemDropdown
 *   item={{
 *     id: 123,
 *     title: "Movie Title",
 *     poster_path: "/path/to/poster.jpg",
 *     release_date: "2024-01-01"
 *   }}
 *   contentType="movie" // or "tv_series"
 *   onWatchlistToggle={() => console.log('Toggle watchlist')}
 *   isInWatchlist={false}
 * />
 */

interface MediaItemDropdownProps {
  item: {
    id: number
    title: string
    poster_path?: string | null
    release_date?: string
  }
  contentType: 'movie' | 'tv_series'
  onWatchlistToggle?: () => void
  isInWatchlist?: boolean
  customButton?: React.ReactNode
}

export default function MediaItemDropdown({
  item,
  contentType,
  onWatchlistToggle,
  isInWatchlist = false,
  customButton,
}: Readonly<MediaItemDropdownProps>) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogForm, setShowLogForm] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768) // md breakpoint
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleCreatePost = () => {
    setIsOpen(false)
    if (!session) {
      router.push('/signin')
      return
    }
    setShowCreatePost(true)
  }

  const handleLogWatching = () => {
    setIsOpen(false)
    if (!session) {
      router.push('/signin')
      return
    }
    setShowLogForm(true)
  }

  const handleWatchlist = () => {
    setIsOpen(false)
    if (!session) {
      router.push('/signin')
      return
    }
    onWatchlistToggle?.()
  }

  const handleReport = () => {
    setIsOpen(false)
    // For now, just show an alert. In a real app, this would open a report form or modal
    alert('Content reported. Thank you for your feedback!')
  }

  const handleButtonClick = (event?: React.MouseEvent) => {
    if (customButton && event?.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right - window.scrollX
      })
    } else if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right - window.scrollX
      })
    }
    setIsOpen(!isOpen)
  }


  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {customButton ? (
          <div onClick={(e) => handleButtonClick(e)}>{customButton}</div>
        ) : (
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            className={`absolute top-1 right-1 p-1 bg-dark-gray cursor-pointer md:opacity-0 ${
              isOpen ? 'opacity-100' : 'group-hover:opacity-100'
            } transition-opacity z-40`}
            aria-label="More options"
          >
            <MoreVertical className="size-4 text-white" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {isOpen && (
            <>
              {isSmallScreen ? (
                // Full screen modal for small screens
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 z-[100] flex items-end"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="w-full bg-dark-gray-2 border-t border-white/5 rounded-t-2xl py-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 px-6">
                      <h3 className="text-xl font-light text-white">Options</h3>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 bg-dark-gray-hover transition-colors"
                      >
                        <X className="size-5 text-gray-300" />
                      </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col gap-2">
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                        onClick={handleCreatePost}
                        className="flex items-center gap-4 px-4 py-4 text-base text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                      >
                        <Plus className="size-5" />
                        Create Post
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, duration: 0.2 }}
                        onClick={handleLogWatching}
                        className="flex items-center gap-4 px-4 py-4 text-base text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                      >
                        <Calendar className="size-5" />
                        Log Watching
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.2 }}
                        onClick={handleWatchlist}
                        className="flex items-center gap-4 px-4 py-4 text-base text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                      >
                        <Bookmark
                          className={`size-5 ${
                            isInWatchlist
                              ? 'fill-light-green text-light-green'
                              : ''
                          }`}
                        />
                        {isInWatchlist
                          ? 'Remove from Watchlist'
                          : 'Add to Watchlist'}
                      </motion.button>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.2 }}
                        className="px-4 py-4 hover:bg-dark-gray-hover transition-colors"
                      >
                        <ShareButton />
                      </motion.div>
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.2 }}
                        onClick={handleReport}
                        className="flex items-center gap-4 px-4 py-4 text-base text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                      >
                        <Bug className="size-5" />
                        Report
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                // Regular dropdown for larger screens
                // Regular dropdown for larger screens
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 bg-dark-gray-2 border border-white/5 z-40 min-w-[160px]"
                >
                  <div className="flex flex-col gap-1">
                    <motion.button
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.15 }}
                      onClick={handleCreatePost}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                    >
                      <Plus className="size-4" />
                      Create Post
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.125, duration: 0.15 }}
                      onClick={handleLogWatching}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                    >
                      <Calendar className="size-4" />
                      Log Watching
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.15 }}
                      onClick={handleWatchlist}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                    >
                      <Bookmark
                        className={`size-4 ${
                          isInWatchlist
                            ? 'fill-light-green text-light-green'
                            : ''
                        }`}
                      />
                      {isInWatchlist
                        ? 'Remove from Watchlist'
                        : 'Add to Watchlist'}
                    </motion.button>
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.175, duration: 0.15 }}
                    >
                      <ShareButton />
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.15 }}
                      onClick={handleReport}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                    >
                      <Bug className="size-4" />
                      Report
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Log Watching Form */}
      <AnimatePresence mode="wait">
        {showLogForm && (
          <LogWatchingForm
            contentId={item.id.toString()}
            contentType={contentType}
            contentTitle={item.title}
            posterPath={item.poster_path || undefined}
            onClose={() => setShowLogForm(false)}
            onSuccess={() => {
              // Optionally refresh data or show success message
            }}
          />
        )}
      </AnimatePresence>

      {/* Create Post Form */}
      <AnimatePresence mode="wait">
        {showCreatePost && (
          <CreatePostForm
            movieId={item.id.toString()}
            movieTitle={item.title}
            contentType={contentType}
            posterPath={item.poster_path}
            onClose={() => setShowCreatePost(false)}
            onSuccess={() => {
              // Optionally refresh data or show success message
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
