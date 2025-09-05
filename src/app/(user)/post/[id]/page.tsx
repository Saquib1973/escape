import AnimatePageWrapper from '@/components/animate-page-wrapper';
import React from 'react'

const PostPage = async ({ params }: { params: Promise<{id:string}> }) => {
  const { id } = await params;
  return (
    <AnimatePageWrapper>PostPage {id}</AnimatePageWrapper>
  )
}

export default PostPage