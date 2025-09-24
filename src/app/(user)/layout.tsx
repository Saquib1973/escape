import AnimatePageWrapper from '@/components/animate-page-wrapper'
import Navbar from '@/components/navbar'
import React from 'react'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePageWrapper className="page-gradient">
      <Navbar />
      <div className="flex justify-center w-full">
        <main className="w-full max-w-5xl py-4 min-h-[calc(100vh-52px)] md:min-h-[calc(100vh-56px)]">
          {children}
        </main>
      </div>
    </AnimatePageWrapper>
  )
}

export default UserLayout
