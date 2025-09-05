import AnimatePageWrapper from '@/components/animate-page-wrapper'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession()
  if (session) redirect('/');

  return (
    <AnimatePageWrapper className="page-gradient">
      {children}
    </AnimatePageWrapper>
  )
}

export default AuthLayout
