'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookText, TvMinimal, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Mobile: Only 3 main items
const mobileSidebarItems = [
  {
    name: 'Profile',
    href: '/profile',
    icon: <User className="size-5" />,
  },
  {
    name: 'Reviews',
    href: '/profile/reviews',
    icon: <BookText className="size-5" />,
  },
  {
    name: 'Watchlist',
    href: '/profile/watchlist',
    icon: <TvMinimal className="size-5" />,
  },
]

// Desktop: Simple profile navigation items
const profileItems = [
  { href: '/profile', label: 'Profile' },
  { href: '/profile/reviews', label: 'Reviews' },
  { href: '/profile/watchlist', label: 'Watchlist' },
  { href: '/profile/lists', label: 'Lists' },
  { href: '/profile/notifications', label: 'Notifications' },
]

export default function ProfileSidebar() {
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState(0)

  // Update active index when pathname changes
  useEffect(() => {
    const index = mobileSidebarItems.findIndex(item => item.href === pathname)
    if (index !== -1) {
      setActiveIndex(index)
    }
  }, [pathname])

  return (
    <div className="w-full md:w-40">
      {/* Mobile: Instagram-style horizontal navigation */}
      <div
        className="md:hidden fixed inset-x-0 bottom-2 backdrop-blur-3xl z-50 px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="relative flex  rounded-full justify-around items-center bg-dark-gray-2 border-t border-dark-gray-hover h-14 w-full">
          {/* Animated background slider with Framer Motion */}
          <motion.div
            className={`absolute bg-light-green rounded-full h-full`}
            animate={{
              left: `${(activeIndex * 100) / mobileSidebarItems.length}%`,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
            style={{
              width: `${100 / mobileSidebarItems.length}%`,
            }}
          />
          {mobileSidebarItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name + index}
                href={item.href}
                className={cn(
                  'relative z-10 flex flex-col items-center rounded-full justify-center py-3 transition-colors duration-200 min-w-0 flex-1',
                  isActive
                    ? 'text-white'
                    : 'text-gray-300 hover:text-light-green'
                )}
              >
                <div className="mb-0.5">{item.icon}</div>
                <span className="text-xs font-medium truncate">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Desktop: Simple vertical sidebar */}
      <aside className="hidden w-full shrink-0 md:block">
        <div className="sticky top-4 overflow-y-auto">
          <nav>
            {profileItems.map(({ href, label }) => {
              const base = 'block px-3 py-1.5 text-sm transition-colors'
              const active = 'text-white bg-light-green'
              const idle = 'hover:text-light-green hover:bg-dark-gray-hover'

              const isActive = pathname === href

              return (
                <Link
                  key={href}
                  href={href}
                  className={`${base} ${isActive ? active : idle}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </div>
  )
}
