import AnimatePageWrapper from '@/components/animate-page-wrapper'
import FeedComponent from '@/components/home-page/feed-component'
import InCinemaComponent from '@/components/home-page/in-cinema-component'
import TrendingComponent from '@/components/home-page/trending-component'
import { getSession } from '@/lib/auth'
import React from 'react'

const HomePage = async () => {
  const session = await getSession()
  return (
    <AnimatePageWrapper className="py-6">
      {session && (
        <div className="text-center py-2 pb-10">
          <h1 className="text-xl font-light text-gray-400">
            Welcome back, {session?.user?.name}. Enjoy reviewing , rating and
            watching...
          </h1>
        </div>
      )}
      <TrendingComponent />
      <InCinemaComponent />
      <FeedComponent />
    </AnimatePageWrapper>
  )
}

export default HomePage
