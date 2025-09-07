'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SimplerPostList from '@/components/simpler-post-list'
import type { SimplerPost } from '@/types/post'

type Props = {
  userId: string
  viewerId: string | null
  name: string
  username: string
  image?: string
  followersCount: number
  followingCount: number
  initialIsFollowing: boolean
  posts: SimplerPost[]
}

const UserDetailScreen: React.FC<Props> = ({
  userId,
  viewerId,
  name,
  username,
  image,
  followersCount,
  followingCount,
  initialIsFollowing,
  posts,
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(initialIsFollowing)
  const [followers, setFollowers] = useState<number>(followersCount)
  const [following, setFollowing] = useState<number>(followingCount)
  const [loading, setLoading] = useState<boolean>(false)

  const canFollow = !!viewerId && viewerId !== userId

  const onToggleFollow = async () => {
    if (!canFollow || loading) return
    const action = isFollowing ? 'unfollow' : 'follow'

    // optimistic update
    setLoading(true)
    setIsFollowing((prev) => !prev)
    setFollowers((prev) => prev + (action === 'follow' ? 1 : -1))

    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, action }),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Failed')
      }
      setFollowers(data.followersCount)
      setFollowing(data.followingCount)
      setIsFollowing(Boolean(data.isFollowing))
    } catch {
      // revert optimistic update
      setIsFollowing((prev) => !prev)
      setFollowers((prev) => prev + (action === 'follow' ? -1 : 1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex max-md:flex-col-reverse max-md:px-2 items-start gap-4 text-gray-300">
      <div className="w-full md:w-[70%]">
        <div className="text-2xl font-light mb-4">Reviews</div>
        <SimplerPostList posts={posts} hrefFor={(post) => `/post/${post.id}`} />
      </div>
      <div className="w-full md:w-[30%] md:sticky top-20 self-start right-0 flex flex-col items-center gap-4">
        <div className="flex items-center w-full gap-4">
          <Image
            src={image ?? ''}
            alt={username}
            width={64}
            height={64}
            unoptimized
          />
          <div className="flex flex-col gap-1">
            <div>
              <div>{name}</div>
              <div className="text-sm text-gray-400">@{username}</div>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-1 text-sm">Followers: {followers}</div>
              <div className="flex gap-1 text-sm">Following: {following}</div>
            </div>
          </div>
        </div>
        {!viewerId && (
          <Link href="/signin">
            <button>Sign in to follow</button>
          </Link>
        )}
        {viewerId && canFollow && (
          <button
            className="w-full p-1 cursor-pointer bg-light-green"
            onClick={onToggleFollow}
            disabled={loading}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  )
}

export default UserDetailScreen
