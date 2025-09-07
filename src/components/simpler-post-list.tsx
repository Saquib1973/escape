import React from 'react'
import Link from 'next/link'
import type { SimplerPost } from '@/types/post'

type Props = {
  posts: SimplerPost[]
  emptyText?: string
  hrefFor: (post: SimplerPost) => string
  cols?:number
}

const SimplerPostList: React.FC<Props> = ({ posts, emptyText = 'No posts yet', hrefFor,cols=1 }) => {
  if (!posts || posts.length === 0) {
    return <div className="text-gray-400">{emptyText}</div>
  }

  return (
    <div className={`grid md:grid-cols-${cols} gap-4`}>
      {posts.map((post) => (
        <Link href={hrefFor(post)} key={post.id}>
          <div className="p-4 bg-dark-gray-2">
            <div className="flex items-center gap-4">
              {post.title ? (
                <div className="font-semibold text-white">{post.title}</div>
              ) : (
                <div className="text-gray-400">
                  {post.content.length > 80
                    ? post.content.slice(0, 80) + '…'
                    : post.content}
                </div>
              )}
              {post.isSpoiler ? (
                <span className="ml-auto text-yellow-400 text-sm">
                  spoiler alert
                </span>
              ) : null}
            </div>
            <div className="mt-1.5 flex gap-3 text-gray-400 text-xs">
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              {post.rating != null ? (
                <span>Rating: {post.rating}/10</span>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default SimplerPostList