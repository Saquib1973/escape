'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import ConversationList from './conversation-list'
import UserSearchList from './user-search-list'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function ChatLeftSidebar() {
  const [q, setQ] = useState('')
  const debounced = useDebounce(q, 300)
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const dropdownItems = [
    { name: 'profile', link: '/profile' },
    { name: 'watchlist', link: '/profile/watchlist' },
    { name: 'lists', link: '/profile/lists' },
    { name: 'reviews', link: '/profile/reviews' },
    { name: 'notifications', link: '/profile/notifications' },
  ]

  const showResults = useMemo(() => debounced.trim().length > 0, [debounced])

  // Close on outside click for all viewports
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!isMenuOpen) return
      const target = e.target as Element
      if (!target.closest('.chat-profile-dropdown')) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [isMenuOpen])

  return (
    <div className="flex h-full flex-col">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search users…"
        className="text-input-2"
      />
      <div className="flex-1 overflow-y-auto">
        {showResults ? (
          <div className="px-0.5 py-2">
            <h3 className="mb-2 text-lg font-light">Search result</h3>
            <UserSearchList query={debounced} />
          </div>
        ) : (
          <div className="px-0.5 py-2">
            <h3 className="mb-2 text-lg font-light">Conversations</h3>
            <ConversationList />
          </div>
        )}
      </div>
      {/* Footer user button */}
      {session && (
        <div className="mt-2 pt-2 border-t border-dark-gray-2">
          <div
            ref={containerRef}
            className="relative chat-profile-dropdown"
          >
            <button
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-dark-gray-hover hover:bg-dark-gray-2 transition-colors`}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 bg-light-green rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src={session.user.image ?? '/logo.png'}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    unoptimized={Boolean(
                      session.user.image?.includes?.('dicebear')
                    )}
                  />
                </div>
                <div className="hidden md:block min-w-0">
                  <div className="truncate text-sm text-gray-200">
                    {session.user.name || session.user.email}
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {session.user.email}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            {/* Dropdown / Panel */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="fixed md:absolute inset-0 md:inset-auto bottom-0 left-0 right-0 z-50 md:z-20 bg-dark-gray-2 border-0 md:border border-dark-gray-2 w-screen h-screen md:w-36 md:h-auto md:rounded md:shadow-lg md:bottom-full md:right-0 md:left-auto md:mb-2"
                >
                  {/* Mobile header */}
                  <div className="flex items-center justify-between md:hidden px-3 py-3 border-b border-dark-gray-hover">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-light-green rounded-full overflow-hidden">
                        <Image
                          src={session.user.image ?? '/logo.png'}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                          unoptimized={Boolean(
                            session.user.image?.includes?.('dicebear')
                          )}
                        />
                      </div>
                      <div className="text-gray-200 text-base">
                        {session.user.name || 'Account'}
                      </div>
                    </div>
                    <button
                      className="p-2 text-gray-300 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex flex-col py-2 md:py-1">
                    {dropdownItems.map((item, index) => (
                      <Link
                        key={item.name + index}
                        href={item.link}
                        className="block capitalize px-4 py-4 md:py-2 text-lg md:text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors border-b border-dark-gray-hover md:border-b-0 max-md:text-2xl"
                        onClick={() => {
                          setIsMenuOpen(false)
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' })
                        setIsMenuOpen(false)
                      }}
                      className="w-full cursor-pointer text-left px-4 py-4 md:py-2 text-lg md:text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors border-b border-dark-gray-hover md:border-b-0 max-md:text-2xl"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
