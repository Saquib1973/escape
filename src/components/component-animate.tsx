'use client'
import React from 'react'
import { motion } from 'framer-motion'
const ComponentAnimate = ({ children }: { children: React.ReactNode }) => {
  return <motion.div>{children}</motion.div>
}

export default ComponentAnimate