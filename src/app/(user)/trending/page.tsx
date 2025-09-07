import AnimatePageWrapper from '@/components/animate-page-wrapper'
import RightSidebar from '@/components/trending/right-sidebar'
import TrendingListComponent from '@/components/trending/trending-list-component'

const TrendingPage = () => {
  return (
    <AnimatePageWrapper className="flex">
      <div className="w-full md:w-[70%] p-2 md:p-6 md:pl-0">
        <div className="py-8">
          <h1 className="text-3xl text-gray-300 font-light mb-2">
            Trending List
          </h1>
          <p className="text-gray-400 text-sm pl-1">
            Discover what&apos;s popular in movies and TV shows
          </p>
        </div>
        <TrendingListComponent />
      </div>
      <RightSidebar />
    </AnimatePageWrapper>
  )
}

export default TrendingPage
