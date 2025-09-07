import AnimatePageWrapper from '@/components/animate-page-wrapper'
import SimplerPostList from '@/components/simpler-post-list'
import Link from 'next/link'
import React from 'react'
import { getUserReviews } from './actions'
import type { SimplerPost } from '@/types/post'

const ReviewsPage = async () => {
  const reviews = await getUserReviews()

  const hrefFor = (post: SimplerPost) => {
    // Determine the correct route based on movie type
    const movieType = post.movieType || 'movie'
    return movieType === 'tv_series'
      ? `/web-series/${post.contentId}`
      : `/movie/${post.contentId}`
  }

  return (
    <AnimatePageWrapper className="text-gray-300 p-2">
      {reviews.length <= 0 ? (
        <div>
          You don&apos;t have any reviews yet. Explore the&nbsp;
          <Link href={'/cinema'} className="underline">
            cinema page
          </Link>
          , watch it and give review on it.
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
          <SimplerPostList
            cols={2}
            posts={reviews}
            emptyText="No reviews yet"
            hrefFor={hrefFor}
          />
        </div>
      )}
    </AnimatePageWrapper>
  )
}

export default ReviewsPage
