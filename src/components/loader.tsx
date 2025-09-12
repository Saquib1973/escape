import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string,
  text?:string
}

const Loader: React.FC<LoaderProps> = ({
  size = 'lg',
  color = '#009D1A',
  className = '',
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }
  const textSize = {
    sm: "text-xs",
    md: "text-xs",
    lg:"text-sm",
    xl:"text-base"
  }

  return (
    <div className={`inline-block w-fit ${sizeClasses[size]} ${className}`}>
      <svg
        className={`animate-spin w-full h-full`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          className="animate-dash"
        />
      </svg>
      <span className={`text-gray-300 ${textSize[size]}`}>{text}</span>
    </div>
  )
}

export default Loader