import { cn } from '@/lib'
import React, { forwardRef } from 'react'

interface InputProps {
  id?: string
  disabled?: boolean
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  type?: 'text' | 'checkbox' | 'email' | "password"
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  autoFocus?: boolean
  checked?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  id = '',
  disabled = false,
  type = 'text',
  value = '',
  onChange,
  required = false,
  placeholder,
  className = '',
  variant = 'primary',
  size = 'md',
  checked = false,
  autoFocus = false,
}, ref) => {
  const currentClassName = {
    primary:
      'text-white placeholder:text-gray-300 bg-dark-gray outline-none w-full',
    secondary:
      'text-white placeholder:text-gray-300 bg-dark-gray-2 outline-none w-full',
  }

  const sizeClasses = {
    sm: 'text-sm p-1.5 px-3',
    md: 'text-base p-2 px-4',
    lg: 'text-base p-3 px-5',
  }
  return (
    <input
      ref={ref}
      id={id}
      disabled={disabled}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      checked={checked}
      autoFocus={autoFocus}
      className={cn(currentClassName[variant], sizeClasses[size], className)}
    />
  )
})

Input.displayName = 'Input'

export default Input
