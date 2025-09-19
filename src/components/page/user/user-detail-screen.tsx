'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PostList from '@/components/post-list'
import { useMutation } from '@tanstack/react-query'
import type { GenericPost } from '@/types/post'

type UserDetailScreenProps = {
  userId: string
  viewerId: string | null
  name: string
  username: string
  image?: string
  followersCount: number
  followingCount: number
  initialIsFollowing: boolean
  posts: GenericPost[]
}

const UserDetailScreen: React.FC<UserDetailScreenProps> = ({
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

  const canFollow = !!viewerId && viewerId !== userId

  const followUserMutation = useMutation({
    mutationFn: async ({ targetUserId, action }: { targetUserId: string; action: 'follow' | 'unfollow' }) => {
      const res = await fetch('/api/user/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, action }),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Failed to follow/unfollow user')
      }
      return data
    },
  })

  const onToggleFollow = async () => {
    if (!canFollow || followUserMutation.isPending) return
    const action = isFollowing ? 'unfollow' : 'follow'

    setIsFollowing((prev) => !prev)
    setFollowers((prev) => prev + (action === 'follow' ? 1 : -1))

    try {
      const data = await followUserMutation.mutateAsync({
        targetUserId: userId,
        action,
      })

      setFollowers(data.followersCount)
      setFollowing(data.followingCount)
      setIsFollowing(Boolean(data.isFollowing))
    } catch (error) {
      setIsFollowing((prev) => !prev)
      setFollowers((prev) => prev + (action === 'follow' ? -1 : 1))
      console.error('Failed to follow/unfollow user:', error)
    }
  }

  return (
    <div className="flex max-md:flex-col-reverse max-md:px-2 items-start gap-4 text-gray-300">
      <div className="w-full md:w-[70%]">
        <div className="text-2xl font-light mb-4">Reviews</div>
        <PostList emptyText={`${username} has not reviewed any movies yet`} posts={posts} />
      </div>
      <div className="w-full md:w-[30%] md:sticky top-20 self-start right-0 flex flex-col items-center gap-4">
        <div className="flex items-center w-full gap-4">
          <Image
            src={image ?? ''}
            alt={username}
            width={64}
            className='bg-light-green rounded-full'
            height={64}
            unoptimized={image?.includes("dicebear")}
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
            className="w-full p-1 cursor-pointer bg-light-green disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onToggleFollow}
            disabled={followUserMutation.isPending}
          >
            {(() => {
              if (followUserMutation.isPending) return 'Loading...'
              return isFollowing ? 'Unfollow' : 'Follow'
            })()}
          </button>
        )}
      </div>
    </div>
  )
}

export default UserDetailScreen
