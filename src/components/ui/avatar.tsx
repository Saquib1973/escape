/* FILE: src/components/ui/avatar.tsx */
import { cn } from '@/lib'
import Image from 'next/image'
import React from 'react'

interface AvatarProps {
  src?: string | null
  alt?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-32 h-32 text-2xl',
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full bg-light-green',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || 'Avatar'}
          fill
          className="aspect-square h-full w-full object-cover"
          unoptimized={src.includes('dicebear')}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-medium text-white">
          {getInitials(alt)}
        </div>
      )}
    </div>
  )
}

export default Avatar