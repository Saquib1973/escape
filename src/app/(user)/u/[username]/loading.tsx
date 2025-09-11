import Loader from '@/components/loader'
import React from 'react'

const LoadingProfile = () => {
  return (
    <div className='flex items-center justify-center h-full'><Loader text='Loading...' /></div>
  )
}

export default LoadingProfile