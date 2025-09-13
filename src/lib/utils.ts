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



