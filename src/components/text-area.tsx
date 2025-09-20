import { cn } from '@/lib'
import React, { forwardRef } from 'react'

interface TextAreaProps {
  id?: string
  disabled?: boolean
  value?: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  autoFocus?: boolean
  rows?: number
  cols?: number
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  id = '',
  disabled = false,
  value = '',
  onChange,
  required = false,
  placeholder,
  className = '',
  variant = 'primary',
  size = 'md',
  autoFocus = false,
  rows = 4,
  cols,
}, ref) => {
  const currentClassName = {
    primary:
      'text-white placeholder:text-gray-300 bg-dark-gray outline-none w-full resize-none',
    secondary:
      'text-white placeholder:text-gray-300 bg-dark-gray-2 outline-none w-full resize-none',
  }

  const sizeClasses = {
    sm: 'text-sm p-1.5 px-3',
    md: 'text-base p-2 px-4',
    lg: 'text-base p-3 px-5',
  }

  return (
    <textarea
      ref={ref}
      id={id}
      disabled={disabled}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoFocus={autoFocus}
      rows={rows}
      cols={cols}
      className={cn(className, currentClassName[variant], sizeClasses[size])}
    />
  )
})

TextArea.displayName = 'TextArea'

export default TextArea