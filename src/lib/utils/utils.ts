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

export function hideContent(content: string) {
  const texts = content.split(" ");
  const updatedTextArray = texts.map((text) => {
    if (text.length === 0) return text;
    return text.split("").map((char, index) => {
      return index % 2 === 0 ? char : "*";
    }).join("");
  })
  const output = updatedTextArray.join(' ');
  return output;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}


// Media helpers (DRY across components)
export function getMediaTitle(item: { title?: string | null; name?: string | null }): string {
  return (item.title || item.name || 'Unknown') as string
}

export function getMediaReleaseYear(item: { release_date?: string | null; first_air_date?: string | null }): string {
  const date = item.release_date || item.first_air_date
  return date ? String(new Date(date).getFullYear()) : 'N/A'
}

