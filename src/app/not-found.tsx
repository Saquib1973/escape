import AnimatePageWrapper from '@/components/animate-page-wrapper'
import Link from 'next/link'

export default function ErrorBoundary() {
  return (
    <AnimatePageWrapper className="page-gradient flex flex-col items-center justify-center min-h-screen">
      <div className="flex gap-4 md:gap-8">
        <div className="bg-white h-[150px] md:h-[300px] aspect-square rounded-full -translate-y-8 flex items-center justify-end ">
          <div className="md:-translate-y-16 translate-y-6 -translate-x-3 md:-translate-x-8 bg-black h-[70px] md:h-[120px] rounded-full aspect-square" />
        </div>
        <div className="bg-white h-[150px] md:h-[300px] aspect-square rounded-full flex items-center justify-start ">
          <div className="translate-y-6 translate-x-3 md:-translate-y-16 md:translate-x-8 bg-black h-[70px] md:h-[120px] rounded-full aspect-square" />
        </div>
      </div>
      <div className="flex items-center justify-center flex-col py-2">
        <h1 className="text-3xl md:text-6xl font-extralight text-white">
          404 , Page Not Found
        </h1>
        <Link
          href={'/'}
          className="bg-dark-gray px-4 py-2 my-4 text-gray-300 cursor-pointer"
        >
          Please Take Me Home
        </Link>
      </div>
    </AnimatePageWrapper>
  )
}
