'use client'

import { ChevronDown, LogOut, Search, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

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
          <div className="flex items-center justify-between gap-2 md:gap-4 h-13 md:h-16 min-w-0">
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
                      className="text-gray-300 capitalize hover:text-white transition-colors text-sm md:text-base"
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
                  <input
                    type="text"
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-3 py-2 bg-dark-gray-hover text-white placeholder-dark-gray-hover outline-none transition-all"
                    autoFocus={isSearchOpen}
                  />
                </form>
              </div>

              <button
                className={`flex gap-1 justify-center items-center p-2 transition-all duration-300 ${
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
  ]
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  if (status === 'loading') {
    return (
      <div className="cursor-not-allowed w-20 md:w-36 h-10 bg-dark-gray-hover flex items-center justify-center text-gray-600 animate-pulse">
        Loading
      </div>
    )
  }

  if (session) {
    console.log(session)
    const username = session.user?.name?.split(' ')[0]
    return (
      <div className="relative w-20 md:w-36 group dropdown-container">
        <button
          className="flex w-full h-10 justify-around items-center md:space-x-2 px-2 md:px-4 group-hover:bg-dark-gray-2 bg-dark-gray-hover py-4 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="w-7 h-7 bg-light-green rounded-full flex items-center justify-center">
            <Image
              src={
                session.user.image ??
                'https://api.dicebear.com/9.x/lorelei/svg?seed=' +
                  session.user.username
              }
              className='rounded-full'
              alt="Profile"
              width={28}
              height={28}
              unoptimized
            />
          </div>
          <span className="text-gray-300 text-sm hidden md:block">
            {username || 'Profile'}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-300" />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 z-[100] border border-dark-gray-2 top-1/2 translate-y-5 w-36 md:w-36 bg-dark-gray-2 transition-all duration-200 ${
            isDropdownOpen
              ? 'opacity-100 visible'
              : 'opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible'
          }`}
        >
          <div className="">
            {dropdownItems.map((item, index) => {
              return (
                <Link
                  key={item.name + index}
                  href={item.link}
                  className="block capitalize px-3 py-2 text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
            <button
              onClick={() => {
                signOut({ callbackUrl: '/' })
                setIsDropdownOpen(false)
              }}
              className="w-full cursor-pointer text-left px-3 py-2 text-sm text-gray-300 hover:bg-dark-gray-hover hover:text-white transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
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
