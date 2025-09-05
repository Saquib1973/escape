import AnimatePageWrapper from '@/components/animate-page-wrapper'
import Link from 'next/link'
import React from 'react'

const ListsPage = () => {
  const lists = []
  return (
    <AnimatePageWrapper className="text-gray-300 p-2">
      {lists.length <= 0 ? (
        <div>
          You don&apos;t have any lists yet.&nbsp;
          <Link href={"/lists/create"} className='underline'>Create list</Link>
        </div>
      ) : (
        <div>Reviews</div>
      )}
    </AnimatePageWrapper>
  )
}

export default ListsPage
