import AnimatePageWrapper from '@/components/animate-page-wrapper'
import Link from 'next/link'
import React from 'react'

const ReviewsPage = () => {
  const reviews = []
  return (
    <AnimatePageWrapper className="text-gray-300 p-2">
      {reviews.length <= 0 ? (
        <div>
          You don&apos;t have any reviews yet. Explore the&nbsp;
          <Link href={"/cinema"} className='underline'>cinema page</Link>, watch it and give review on it.
        </div>
      ) : (
        <div>Reviews</div>
      )}
    </AnimatePageWrapper>
  )
}

export default ReviewsPage
