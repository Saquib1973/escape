'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Sign Out
    </button>
  )
}
