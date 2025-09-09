import AnimatePageWrapper from '@/components/animate-page-wrapper'
import FeedComponent from '@/components/home-page/feed-component'
import InCinemaComponent from '@/components/home-page/in-cinema-component'
import TrendingMovieComponent from '@/components/home-page/trending-movie-component'
import TrendingWebSeriesComponent from '@/components/home-page/trending-web-series-component'
import { getSession } from '@/lib/auth'
import React from 'react'
import AiRecommendationComponent from './../../components/ai-recommendation-component';

const HomePage = async () => {
  const session = await getSession()
  return (
    <AnimatePageWrapper className="py-6">
      {session && (
        <div className="text-center py-2 pb-6">
          <h1 className="text-xl font-light text-gray-400">
            Welcome back, <span className='text-light-green'>{session?.user?.name}</span>. Enjoy reviewing ,
            rating and watching...
          </h1>
        </div>
      )}
      <AiRecommendationComponent />
      <TrendingMovieComponent />
      <TrendingWebSeriesComponent />
      <InCinemaComponent />
      <FeedComponent />
    </AnimatePageWrapper>
  )
}

export default HomePage
