'use client'

import Link from 'next/link'
import AnimatePageWrapper from '@/components/animate-page-wrapper'

interface SettingItem {
  href: string
  label: string
  description: string
  isAvailable: boolean
}

interface SettingSection {
  title: string
  items: SettingItem[]
}

const SETTINGS: SettingSection[] = [
  {
    title: 'Basic Info',
    items: [
      {
        href: '/settings/profile',
        label: 'Profile',
        description: 'Manage your basic information like name, bio, and social links',
        isAvailable: true
      },
      {
        href: '/settings/username',
        label: 'Username',
        description: 'Update your public username (3-20 characters)',
        isAvailable: true
      }
    ]
  },
  {
    title: 'Account',
    items: [
      {
        href: '/settings/security',
        label: 'Security',
        description: 'Password, two-factor authentication, and login security',
        isAvailable: false
      },
      {
        href: '/settings/delete-account',
        label: 'Delete Account',
        description: 'Permanently delete your account and all data',
        isAvailable: true
      }
    ]
  },
  {
    title: 'Billing',
    items: [
      {
        href: '/settings/billing',
        label: 'Billing',
        description: 'Payment methods, subscription, and billing history',
        isAvailable: false
      },
    ]
  }
]

export default function SettingsHomePage() {
  return (
    <AnimatePageWrapper className="space-y-6">
      <div>
        <h1 className="text-lg text-white">Settings</h1>
        <p className="text-sm text-gray-300">
          Manage your account settings
        </p>
      </div>

      <div className="space-y-4">
        {SETTINGS.map((section) => (
          <div key={section.title} className="space-y-2">
            <h2 className="text-xs text-gray-400 uppercase tracking-wide">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.isAvailable ? item.href : '#'}
                  className={`block p-3 transition-colors ${
                    item.isAvailable
                      ? 'hover:bg-dark-gray-hover'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm text-white">
                        {item.label}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    {!item.isAvailable && (
                      <span className="text-xs text-gray-500">
                        Soon
                      </span>
                    )}
                    {item.isAvailable && (
                      <span className="text-xs text-gray-400">
                        →
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-dark-gray">
        <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
          Quick Actions
        </h2>
        <div className="space-y-1">
          <Link
            href="/profile"
            className="block p-3 hover:bg-dark-gray-hover transition-colors"
          >
            <span className="text-sm text-white">View Profile</span>
          </Link>
          <Link
            href="/feed"
            className="block p-3 hover:bg-dark-gray-hover transition-colors"
          >
            <span className="text-sm text-white">Go to Feed</span>
          </Link>
        </div>
      </div>
    </AnimatePageWrapper>
  )
}

