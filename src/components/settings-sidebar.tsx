'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS: { title: string; items: { href: string; label: string }[] }[] =
  [
    {
      title: 'Basic Info',
      items: [
        { href: '/settings', label: 'Overview' },
        { href: '/settings/username', label: 'Username' },
      ],
    },
    {
      title: 'Account',
      items: [
        { href: '/settings/security', label: 'Security' },
        { href: '/settings/delete-account', label: 'Delete Account' },
      ],
    },
    {
      title: 'Billing',
      items: [
        { href: '/settings/billing', label: 'Billing' },
      ],
    },
  ]

export default function SettingsSidebar() {
  const pathname = usePathname()

  const base = 'block px-3 py-1.5 text-sm transition-colors'
  const active = 'text-white bg-light-green'
  const idle =
    'hover:text-light-green hover:bg-dark-gray-hover'

  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="sticky top-18 max-h-[calc(100vh-4rem)] overflow-y-auto p-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="">
            <div className="mt-2 px-3 py-1.5 text-sm font-light uppercase tracking-wide text-zinc-400">
              {section.title}
            </div>
            <nav>
              {section.items.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${base} ${pathname === href ? active : idle}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}
