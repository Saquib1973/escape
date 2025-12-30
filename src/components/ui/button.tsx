"use client"
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'secondary-light' | 'outline' | 'ghost' | 'danger'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-colors outline-none disabled:pointer-events-none disabled:opacity-70 cursor-pointer'

    const variants = {
      primary: 'bg-light-green text-white hover:bg-opacity-90',
      secondary: 'bg-dark-gray-2 text-white cursor-pointer w-full',
      "secondary-light": "bg-dark-gray text-gray-300 cursor-pointer w-full",
      outline:
        'border border-gray-600 bg-transparent text-gray-300 hover:bg-dark-gray-2 hover:text-white',
      ghost: 'hover:bg-dark-gray-2 hover:text-white text-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    }

    const sizes = {
      default: 'p-2 h-10 text-base',
      sm: 'p-1 h-8 text-sm',
      lg: 'p-3 h-12 text-base',
      icon: 'h-9 w-9 p-0',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button