'use client'

import { ChevronDown, Monitor, BookOpen, Clapperboard } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ContentType {
  name: string
  label: string
  icon: React.ElementType
  path: string
}

const contentTypes: ContentType[] = [
  { name: 'movies', label: 'Movies', icon: Clapperboard, path: '/' },
  { name: 'books', label: 'Books', icon: BookOpen, path: '/books' },
  { name: 'tech', label: 'Tech', icon: Monitor, path: '/tech' },
]

const TypeSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // Determine current active type based on pathname
  const getCurrentType = () => {
    if (pathname?.startsWith('/books')) return contentTypes[1]
    if (pathname?.startsWith('/tech')) return contentTypes[2]
    return contentTypes[0]
  }

  const currentType = getCurrentType()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleTypeChange = (path: string) => {
    router.push(path)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1 mt-1 transition-all",
          isOpen
            ? "bg-white/5 text-white"
            : "cursor-pointer hover:bg-white/5 text-gray-200"
        )}
      >
        <span className="flex items-center gap-2 text-xs font-medium">
          {currentType.label}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 shadow-2xl mt-2 min-w-28 w-fit bg-dark-gray-2 border-transparent overflow-hidden"
          >
            <div className="p-1 flex flex-col gap-0.5">
              {contentTypes.map((type) => {
                const isActive = type.name === currentType.name
                const Icon = type.icon
                
                return (
                  <button
                    key={type.name}
                    onClick={() => handleTypeChange(type.path)}
                    className={cn(
                      "flex items-center cursor-pointer gap-3 w-full px-2 py-1.5 text-xs transition-colors",
                      isActive
                        ? "bg-white/10 text-white font-medium"
                        : "text-gray-400 hover:text-gray-200"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TypeSelector