import AnimatePageWrapper from '@/components/animate-page-wrapper'
import CinemaList from '@/components/cinema-list'
import FeedComponent from '@/components/page/home/feed-component'
import InCinemaComponent from '@/components/page/home/in-cinema-component'
import TrendingMovieComponent from '@/components/page/home/trending-movie-component'
import TrendingWebSeriesComponent from '@/components/page/home/trending-web-series-component'
import VerticalCinemaList from '@/components/vertical-cinema-list'
import WelcomeMessage from '@/components/welcome-message'
import { getSession } from '@/lib'

const HomePage = async () => {
  const session = await getSession()
  return (
    <AnimatePageWrapper className="py-4 max-md:px-4">

      {session && (
        <WelcomeMessage username={session?.user?.name ?? ''} />
      )}

      <TrendingMovieComponent />
      <TrendingWebSeriesComponent />
      <InCinemaComponent />
      
      <div className="flex max-md:flex-col gap-4 relative">
        <FeedComponent />
        <VerticalCinemaList
          className="max-lg:hidden lg:max-w-84"
          title="Upcoming Movies"
          subHeading="Discover upcoming movies"
          apiUrl="/api/upcoming"
          showEmptyState={true}
          contentType="movie"
          showDropdown={true}
        />
        <CinemaList
          className="lg:hidden"
          subHeading="Discover upcoming movies"
          title="Upcoming Movies"
          apiUrl="/api/upcoming"
          showEmptyState={true}
          scrollContainerClass="upcoming-movie-scroll-container"
          contentType="movie"
          showDropdown={true}
        />
      </div>
    </AnimatePageWrapper>
  )
}

export default HomePage
