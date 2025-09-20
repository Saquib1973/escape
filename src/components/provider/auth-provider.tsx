'use client'
import { SessionProvider, useSession } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  if (status === 'loading') {
    return <LoadingSession />
  }
  if (status === 'unauthenticated') {
    return <UnauthenticatedSession />
  }
  return <>{children}</>
}

function LoadingSession() {
  return <div>Loading...</div>
}
function UnauthenticatedSession() {
  return <div>Unauthorized...</div>
}
