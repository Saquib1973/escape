import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RatingEnum } from '@/types/post'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const ratingLabelMap: Record<RatingEnum, string> = {
  TRASH: 'Trash',
  TIMEPASS: 'Timepass',
  ONE_TIME_WATCH: 'One-time watch',
  MUST_WATCH: 'Must watch',
  LEGENDARY: 'Legendary',
}

export function getRatingLabel(rating: RatingEnum): string {
  return ratingLabelMap[rating]
}



