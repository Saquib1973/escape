import AnimatePageWrapper from '@/components/animate-page-wrapper'
import CinemaList from '@/components/cinema-list'
import FeedComponent from '@/components/page/home/feed-component'
import InCinemaComponent from '@/components/page/home/in-cinema-component'
import TrendingMovieComponent from '@/components/page/home/trending-movie-component'
import TrendingWebSeriesComponent from '@/components/page/home/trending-web-series-component'
import VerticalCinemaList from '@/components/vertical-cinema-list'
import { getSession } from '@/lib'

const HomePage = async () => {
  const session = await getSession()
  return (
    <AnimatePageWrapper className="py-4 max-md:px-4">
      {session && (
        <div className="text-center pb-4">
          <h1 className="text-lg font-light text-gray-400">
            Welcome back,{' '}
            <span className="text-light-green">{session?.user?.name}</span>.
            Enjoy reviewing , rating and watching...
          </h1>
        </div>
      )}
      <TrendingMovieComponent />
      <TrendingWebSeriesComponent />
      <InCinemaComponent />
      <div className="flex max-md:flex-col gap-4 relative">
        <FeedComponent />
        <VerticalCinemaList
          className="sticky top-[70px] max-lg:hidden lg:max-w-84 right-0"
          title="Upcoming Movies"
          subHeading="Discover upcoming movies"
          apiUrl="/api/upcoming"
          showEmptyState={true}
          />
        <CinemaList
          className="sticky top-[70px] lg:hidden lg:max-w-84 right-0"
          subHeading="Discover upcoming movies"
          title="Upcoming Movies"
          apiUrl="/api/upcoming"
          showEmptyState={true}
          scrollContainerClass="upcoming-movie-scroll-container"
        />
      </div>
    </AnimatePageWrapper>
  )
}

export default HomePage
