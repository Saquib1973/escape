import React from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AnimatePageWrapper from '@/components/animate-page-wrapper'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePageWrapper className="min-h-screen page-gradient">
      <Navbar />
      <div className="flex justify-center w-full">
        <main className="w-full max-w-5xl py-4 min-h-[calc(100vh-0px)]">{children}</main>
      </div>
      <Footer />
    </AnimatePageWrapper>
  )
}

export default UserLayout
