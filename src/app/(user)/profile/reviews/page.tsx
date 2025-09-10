import AnimatePageWrapper from '@/components/animate-page-wrapper'
import Link from 'next/link'
import React from 'react'
import { getUserReviews } from './actions'
import PostList from '@/components/post-list'

const ReviewsPage = async () => {
  const reviews = await getUserReviews()

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
          <PostList posts={reviews} emptyText="No reviews yet" />
        </div>
      )}
    </AnimatePageWrapper>
  )
}

export default ReviewsPage
