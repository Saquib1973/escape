'use client'

import { ChevronDown, LogOut, Search, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Loader from './ui/loader'
import Input from './ui/input'
import TypeSelector from './type-selector'

const navbarItems = [
  {
    name: 'lists',
    link: '/lists',
  },
  {
    name: 'trending',
    link: '/trending',
  },
]

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isSearchOpen) {
      setSearchQuery('')
    }
  }
  const router = useRouter()
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/search?q=' + searchQuery)
  }

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    }

    return () => {}
  }, [isSearchOpen])
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        container.current &&
        !container.current.contains(event.target as Node) &&
        isSearchOpen
      ) {
        setIsSearchOpen(false)
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])

  return (
    <div className="sticky max-md:px-2 max-md:pl-4 top-0 left-0 right-0 bg-dark-gray z-50 w-full ">
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-5xl">
          <div className="flex items-center justify-between gap-2 md:gap-4 h-13 md:h-14 min-w-0">
            <div className="flex items-center gap-3">
              <Link href={'/'} className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <Image
                    alt="logo"
                    className=""
                    src={'/logo-light.png'}
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-xl text-white max-md:hidden">Escape</span>
              </Link>
              <TypeSelector />
            </div>

            <div className="flex items-center gap-1 md:gap-2 min-w-0">
              <div
                className={`flex items-center gap-2 md:gap-3 font-light transition-all duration-300 ${
                  isSearchOpen
                    ? 'opacity-0 scale-95 translate-x-2 pointer-events-none'
                    : 'opacity-100 scale-100 translate-x-0'
                }`}
              >
                {navbarItems.map((item, index) => {
                  return (
                    <Link
                      key={index + item.name}
                      href={item.link}
                      className={`text-gray-300 capitalize hover:text-white transition-colors text-sm md:text-base ${isSearchOpen ? "hidden":""}`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              {/* Search Input */}
              <div
                ref={container}
                className={`transition-all duration-300 ease-in-out ${
                  isSearchOpen
                    ? 'w-48 md:w-64 opacity-100 scale-100'
                    : 'w-0 opacity-0 scale-95 overflow-hidden'
                }`}
              >
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Input
                    type="text"
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    variant="secondary"
                    autoFocus={isSearchOpen}

                  />
                </form>
              </div>

              <button
                className={`flex gap-1 justify-center h-full items-center p-2 transition-all duration-300 ${
                  isSearchOpen ? 'bg-light-green text-white' : 'text-gray-300'
                }`}
                onClick={
                  !isSearchOpen ? handleSearchToggle : handleSearchSubmit
                }
              >
                <Search className="w-5 h-5" />
              </button>
              <RenderAuthSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RenderAuthSection = () => {
  const dropdownItems = [
    {
      name: 'profile',
      link: '/profile',
    },
    {
      name: 'watchlist',
      link: '/profile/watchlist',
    },
    {
      name: 'lists',
      link: '/profile/lists',
    },
    {
      name: 'reviews',
      link: '/profile/reviews',
    },
    {
      name: 'notifications',
      link: '/profile/notifications',
    },
    {
      name: 'settings',
      link: '/settings',
    },

  ]
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Handle click outside behavior for mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const isMobile = window.innerWidth < 768

      if (isMobile) {
        if (!target.closest('.dropdown-container')) {
          setIsDropdownOpen(false)
        }
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  if ( status === 'loading') {
    return (
      <div className="cursor-not-allowed w-10 max-md:rounded-full md:w-36 h-10 bg-dark-gray-hover flex items-center justify-center text-gray-600 gap-1 animate-pulse">
        <span className='max-md:hidden'>Loading</span>
        <Loader size="sm" />
      </div>
    )
  }

  if (session) {
    const userImage = session.user.image ?? ""
    const username = session.user?.name?.split(' ')[0]
    const menuVariants = {
      open: {
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0,
        },
      },
      closed: {
        transition: {
          staggerChildren: 0.05,
          staggerDirection: -1,
        },
      },
    }
    const itemVariants = {
      closed: { opacity: 0, x: -10 },
      open: { opacity: 1, x: 0 },
    }
    return (
      <div
        className="relative w-10 md:w-36 group dropdown-container"
        onMouseEnter={() => {
          // Keep dropdown open when hovering over the entire container
          if (window.innerWidth >= 768) {
            setIsHovered(true)
          }
        }}
        onMouseLeave={() => {
          // Close on hover leave for desktop
          if (window.innerWidth >= 768) {
            setIsHovered(false)
          }
        }}
        role="menu"
        aria-label="User profile dropdown"
        tabIndex={-1}
      >
        <button
          className={`flex w-full max-md:rounded-full h-10 justify-center md:justify-around items-center md:space-x-2  md:p-4 transition-colors ${
            isDropdownOpen || isHovered
              ? 'bg-dark-gray-2'
              : 'bg-dark-gray-hover group-hover:bg-dark-gray-2'
          }`}
          onClick={() => {
            // Only toggle on mobile devices
            if (window.innerWidth < 768) {
              setIsDropdownOpen(!isDropdownOpen)
            }
          }}
        >
          <div className="md:size-8 size-10 bg-light-green rounded-full flex items-center justify-center">
            <Image
              src={userImage}
              className="rounded-full"
              alt="Profile"
              width={34}
              height={34}
              unoptimized={userImage.includes('dicebear')}
            />
          </div>
          <span className="text-gray-300 text-sm hidden md:block">
            {username || 'Profile'}
          </span>
          <motion.div
            animate={{ rotate: isDropdownOpen || isHovered ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <ChevronDown className="size-4 max-md:hidden text-gray-300" />
          </motion.div>
        </button>
        {/* Dropdown Menu */}
        <AnimatePresence mode="wait">
          {(isDropdownOpen || isHovered) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { delay: innerWidth<768 ? 0.56 : 0 } }}
              transition={{
                ease: 'easeOut',
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="fixed md:absolute right-0 z-[100] border border-dark-gray-2 top-0 md:top-full inset-0 md:inset-auto h-screen md:h-auto w-screen md:w-36 bg-dark-gray-2"
            >
              <motion.div
                className="flex flex-col h-full md:h-auto pt-4 md:pt-0 px-0"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {/* Close Button */}
                <motion.div
                  className="flex justify-end mb-4 md:hidden pr-4"
                >
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      setIsHovered(false)
                    }}
                    className="p-2 mr-2 text-gray-300 hover:text-white hover:bg-dark-gray-hover transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </motion.div>
                {dropdownItems.map((item, index) => {
                  return (
                    <motion.div key={item.name + index} variants={itemVariants}>
                      <Link
                        href={item.link}
                        className="block capitalize px-4 py-4 md:py-2 text-lg md:text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors border-b border-dark-gray-hover md:border-b-0 max-md:text-2xl"
                        onClick={() => {
                          // Close dropdown when clicking any menu item
                          setIsDropdownOpen(false)
                          setIsHovered(false)
                        }}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
                <motion.div variants={itemVariants}>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      // Close dropdown when clicking sign out
                      setIsDropdownOpen(false)
                      setIsHovered(false)
                    }}
                    className="w-full cursor-pointer text-left px-4 py-4 md:py-2 text-lg md:text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors flex items-center space-x-2 border-b border-dark-gray-hover md:border-b-0 max-md:text-2xl"
                  >
                    <LogOut className="size-5 md:w-4 md:h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex w-20 md:w-36 items-center">
      <Link
        href="/signin"
        className="md:hidden w-full h-10 text-gray-300 bg-dark-gray-hover transition-colors px-2 flex items-center justify-center"
      >
        SignIn
      </Link>
      <Link
        href="/signin"
        className="max-md:hidden w-full h-10 text-gray-300 bg-dark-gray-hover transition-colors px-4 flex items-center justify-center"
      >
        Get Started
      </Link>
    </div>
  )
}

export default Navbar
