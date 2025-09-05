'use client'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'

const sections = ['profile', 'watchlist', 'lists', 'reviews', 'notifications']

const UserProfileTabSection = () => {
  const router = useRouter()
  const pathname = usePathname()

  const currentTab = pathname.split('/').pop() || 'profile'

  const handleTabClick = (section: string) => {
    if (section === 'profile') {
      router.push('/profile')
    } else {
      router.push(`/profile/${section}`)
    }
  }

  return (
    <div className="w-full py-6">
      <div className="flex text-gray-300 text-lg">
        {sections.map((section, index) => {
          const isActive =
            (section === 'profile' && currentTab === 'profile') ||
            (section !== 'profile' && currentTab === section)

          return (
            <button
              key={index + section}
              onClick={() => handleTabClick(section)}
              className={`px-5 py-1 cursor-pointer transition-colors capitalize ${
                isActive ? 'bg-light-green text-white' : 'hover:bg-dark-gray-hover'
              }`}
            >
              {section}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default UserProfileTabSection
