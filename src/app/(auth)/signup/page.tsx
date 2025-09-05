import { SignUpForm } from '@/components/forms/signup-form'
import { GoogleButton } from '@/components/buttons/google-button'
import Link from 'next/link'
import AnimatePageWrapper from '@/components/animate-page-wrapper'

export default function SignUp() {
  return (
    <AnimatePageWrapper className="flex bg-light-gray text-gray-300 flex-col gap-2 items-center py-10 lg:py-32 min-h-screen">
      <div className="max-w-xl flex items-center justify-center flex-col gap-3 w-full">
        <div className="flex flex-col text-5xl py-6 gap-1 w-full font-light">
          <h1 className="">Join Us!</h1>
          <h1 className="">Create Your</h1>
          <h1 className="">Account</h1>
        </div>

        <SignUpForm />
        <div className="my-4">or</div>
        <GoogleButton />
        <div className='flex gap-1'>
          <p>Already have an account?</p>
          <Link href={'/signin'} className='underline'>
            Sign In
          </Link>
        </div>
      </div>
    </AnimatePageWrapper>
  )
}
