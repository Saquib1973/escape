import { cn } from '@/lib'
import React from 'react'

interface HeaderProps {
  title: string
  subHeading?: string
  className?:string
}

const Header = ({ title, subHeading,className }: HeaderProps) => {
  return (
    <div className={cn('mb-6',className)}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-0.5 h-8 bg-light-green rounded-full"></div>
        <h1 className="text-2xl text-gray-200 font-light">{title}</h1>
      </div>
      {subHeading && <div className="max-md:hidden text-sm text-gray-400">{subHeading}</div>}
    </div>
  )
}

export default Header
