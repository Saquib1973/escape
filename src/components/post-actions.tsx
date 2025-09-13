'use client'

import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface PostActionsProps {
  postId: string
  likesCount: number
  dislikesCount: number
  commentsCount: number
  isLoggedIn: boolean
  userLiked?: boolean
  userDisliked?: boolean
}

export default function PostActions({
  postId,
  likesCount,
  dislikesCount,
  commentsCount,
  isLoggedIn,
  userLiked = false,
  userDisliked = false,
}: PostActionsProps) {
  const router = useRouter()
  const [likes, setLikes] = useState(likesCount)
  const [dislikes, setDislikes] = useState(dislikesCount)
  const [isLiked, setIsLiked] = useState(userLiked)
  const [isDisliked, setIsDisliked] = useState(userDisliked)
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: 'like' | 'dislike') => {
    if (!isLoggedIn) {
      router.push('/signin')
      return
    }

    if (isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/post/${postId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to update reaction')
      }

      const data = await response.json()

      if (action === 'like') {
        if (data.action === 'added') {
          setLikes(prev => prev + 1)
          setIsLiked(true)
          if (isDisliked) {
            setDislikes(prev => prev - 1)
            setIsDisliked(false)
          }
        } else {
          setLikes(prev => prev - 1)
          setIsLiked(false)
        }
      } else {
        if (data.action === 'added') {
          setDislikes(prev => prev + 1)
          setIsDisliked(true)
          if (isLiked) {
            setLikes(prev => prev - 1)
            setIsLiked(false)
          }
        } else {
          setDislikes(prev => prev - 1)
          setIsDisliked(false)
        }
      }
    } catch (error) {
      console.error('Error updating reaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 max-md:gap-4 flex items-center">
      <button
        onClick={() => handleAction('like')}
        disabled={isLoading}
        className={`flex items-center gap-2 cursor-pointer hover:bg-dark-gray-hover md:p-2 md:px-4 text-gray-300 transition-colors  ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ThumbsUp
          className={`size-4 ${isLiked ? 'text-gray-300 fill-white' : ''}`}
          />
        <span className="text-sm font-medium">{likes}</span>
      </button>

      <button
        onClick={() => handleAction('dislike')}
        disabled={isLoading}
        className={`flex items-center gap-2 cursor-pointer hover:bg-dark-gray-hover md:p-2 md:px-4 text-gray-300 transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ThumbsDown
          className={`size-4 ${isDisliked ? 'text-gray-300 fill-white' : ''}`}
        />
        <span className="text-sm font-medium">{dislikes}</span>
      </button>

      <div className="flex items-center gap-2 cursor-pointer hover:bg-dark-gray-hover md:p-2 md:px-4 text-gray-300">
        <MessageCircle className="size-4" />
        <span className="text-sm font-medium">{commentsCount}</span>
      </div>
    </div>
  )
}
