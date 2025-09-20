import Link from 'next/link'
import AnimatePageWrapper from '@/components/animate-page-wrapper';

export default function UsernameSettingsPage() {
  return (
    <AnimatePageWrapper className="space-y-4">
      <div className="flex items-center space-x-3">
        <Link
          href="/settings"
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Settings
        </Link>
      </div>

      <div>
        <h2 className="text-lg text-white">Username</h2>
        <p className="text-sm text-gray-400">
          Update your public username. It must be unique and 3–20 characters.
        </p>
      </div>

      {/* Replace with your actual form */}
      <div className="p-4 border border-dark-gray bg-dark-gray-2">
        <p className="text-sm text-gray-400">Username form goes here.</p>
      </div>
    </AnimatePageWrapper>
  )
}