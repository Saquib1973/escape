import { getAllFeedPosts, getPostsWithPosters } from '@/app/(user)/post/actions'
import PostList from '@/components/post-list'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-6">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={`loading-skeleton-${i}`} className="p-6 px-4 animate-pulse">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-36 h-48 bg-dark-gray"></div>
            </div>
            <div className="flex flex-col min-w-0 w-full">
              <div className="flex items-center gap-1 mb-2">
                <div className="w-8 h-8 bg-dark-gray rounded-full"></div>
                <div className="h-4 bg-dark-gray w-20"></div>
              </div>
              <div className="mb-1">
                <div className="h-6 bg-dark-gray w-48 mb-1"></div>
                <div className="h-4 bg-dark-gray w-12"></div>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, j) => (
                    <div key={j} className="w-4 h-4 bg-dark-gray"></div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-dark-gray"></div>
                  <div className="h-4 bg-dark-gray w-6"></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="h-3 bg-dark-gray w-full mb-1"></div>
                <div className="h-3 bg-dark-gray w-5/6 mb-1"></div>
                <div className="h-3 bg-dark-gray w-4/5"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-dark-gray"></div>
                  <div className="h-4 bg-dark-gray w-20"></div>
                </div>
                <div className="h-4 bg-dark-gray w-12"></div>
              </div>
            </div>
          </div>
          <div className="mt-6 w-[80%] mx-auto h-0.5 bg-dark-gray"></div>
        </div>
      ))}
    </div>
  )
}

async function FeedServer() {
  try {
    const posts = await getAllFeedPosts()

    if (posts.length === 0) {
      return (
        <div className="py-6 text-center">
          <p className="text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      )
    }

    const genericPosts = await getPostsWithPosters(posts)

    return <PostList posts={genericPosts} emptyText="No reviews yet. Be the first to share your thoughts!" />
  } catch (error) {
    console.error('Error fetching feed data:', error)
    return (
      <div className="py-6 text-center">
        <p className="text-red-400">Failed to load reviews</p>
      </div>
    )
  }
}

export default function FeedComponent() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-md:px-4">
        <h1 className="text-2xl text-gray-300">Reviews</h1>
        <Suspense fallback={<FeedSkeleton />}>
          <FeedServer />
        </Suspense>
      </div>
      <div className="flex justify-self-end pt-2 px-3">
        <Link
          href="/feed"
          className="text-gray-300 hover:text-white text-sm transition-all flex gap-1 items-center justify-center"
        >
          Show More
          <ChevronDown />
        </Link>
      </div>
    </div>
  )
}
