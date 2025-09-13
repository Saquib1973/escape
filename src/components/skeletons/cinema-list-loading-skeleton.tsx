
import React from 'react'
import Loader from '../loader'

interface CinemaListLoadingSkeletonProps {
  itemCount?: number
}

const CinemaListLoadingSkeleton: React.FC<CinemaListLoadingSkeletonProps> = ({ itemCount = 8 }) => {
  const bdList = [
    'bg-gradient-to-bl to-light-gray from-dark-gray-2',
    'bg-gradient-to-tr delay-100 from-light-gray to-dark-gray-2',
  ]
  return (
    <div className="w-full h-fit">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: itemCount }, (_, index) => (
          <div key={index + 'loading-skeleton'} className="flex-shrink-0 w-36">
            <div className={`${bdList[index % bdList.length]} overflow-hidden`}>
              <div className="flex flex-col w-full h-60">
                {/* Poster skeleton - large area for movie poster */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-dark-gray-2 to-dark-gray animate-pulse">
                    {/* <Loader size="md" text="Loading..." /> */}
                  </div>
                </div>

                {/* Rating section skeleton */}
                <div className="flex items-center p-2 justify-between bg-dark-gray-2/90">
                  <div className="w-8 h-2.5 bg-dark-gray-hover animate-pulse"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2.5 bg-dark-gray-hover animate-pulse"></div>
                    <div className="w-6 h-2.5 bg-dark-gray-hover animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CinemaListLoadingSkeleton
