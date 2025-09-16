'use client'

import { cn } from '@/lib'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

interface AnimatePageWrapperProps {
  children: React.ReactNode
  className?: string
}

const AnimatePageWrapper: React.FC<AnimatePageWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        className={cn(className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimatePageWrapper
