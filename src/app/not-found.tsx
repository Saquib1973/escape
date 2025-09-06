'use client'

import AnimatePageWrapper from '@/components/animate-page-wrapper'
import { useRouter } from 'next/navigation'

export default function ErrorBoundary() {
  const router = useRouter()

  return (
    <AnimatePageWrapper className="min-h-screen flex items-center justify-center flex-col page-gradient">
      <h1 className="text-9xl text-white">404</h1>
      <p className="text-gray-300 text-sm">
        {"Page you are looking for doesn't exist or has been removed."}
      </p>
      <button
        onClick={() => router.push('/')}
        className="bg-dark-gray px-4 py-2 my-4 text-gray-300 cursor-pointer"
      >
        Go Home
      </button>
    </AnimatePageWrapper>
  )
}
