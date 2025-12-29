'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import AnimatePageWrapper from '@/components/animate-page-wrapper'
import Input from '@/components/ui/input'

export default function DeleteAccountPage() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      setError('Please type "DELETE" to confirm account deletion')
      return
    }

    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete account')
      }

      // Sign out the user immediately after successful deletion
      await signOut({ callbackUrl: '/signin' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsDeleting(false)
    }
  }

  return (
    <AnimatePageWrapper className="space-y-6 text-gray-300">
      <div className="max-w-2xl">
        <div className="mb-4">
          <Link
            href="/settings"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Settings
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Delete Account</h1>
          <p className="text-sm">
            This action cannot be undone. Your account will be permanently
            deleted.
          </p>
        </div>

        <div className="bg-dark-gray-2 p-4">
          <h2 className="mb-2 text-base font-semibold ">
            What happens when you delete your account?
          </h2>
          <ul className="space-y-2 text-xs ">
            <li>• You will no longer be able to log in to your account</li>
            <li>
              • Your posts, comments, and interactions will remain visible
            </li>
            <li>• Your username will be permanently reserved</li>
            <li>• You will not receive any notifications</li>
            <li>• This action cannot be reversed</li>
          </ul>
        </div>

        <div className="mt-6">
          <div className=''>
            <label htmlFor="confirmation" className="block text-sm ">
              To confirm, type{' '}
              <span className="font-mono font-bold">DELETE</span> in the box
              below:
            </label>
            <Input
              id="confirmation"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              variant='secondary'
              className='mt-2'
              placeholder="Type DELETE to confirm"
              disabled={isDeleting}
            />
          </div>

          {error && (
            <div className="">
              <p className="text-sm text-red-700 ">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting || confirmationText !== 'DELETE'}
              className="bg-red-700 hover:bg-red-600 py-2 px-3 transition-colors cursor-pointer"
            >
              {isDeleting ? 'Deleting Account...' : 'Delete My Account'}
            </button>
            <button
              onClick={() => router.back()}
              disabled={isDeleting}
              className="bg-dark-gray hover:bg-dark-gray-hover py-2 px-3 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </AnimatePageWrapper>
  )
}
