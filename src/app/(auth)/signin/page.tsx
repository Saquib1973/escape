import { SignInForm } from '@/components/forms/signin-form'
import { GoogleButton } from '@/components/buttons/google-button'
import Link from 'next/link'
import AnimatePageWrapper from '@/components/animate-page-wrapper'

export default function SignIn() {
  return (
    <AnimatePageWrapper className="max-md:px-2 flex bg-light-gray text-gray-300 flex-col gap-2 items-center py-10 lg:py-32 min-h-screen">
      <div className="max-w-lg flex items-center justify-center flex-col gap-3 w-full">
        <div className="flex flex-col text-4xl py-2 gap-1 w-full font-light">
          <h1 className="">Hello Again!</h1>
          <h1 className="">Welcome</h1>
          <h1 className="">back</h1>
        </div>
        {/* Sign-In Component */}
        <SignInForm />
        <div className="">or</div>
        {/* Google sigin button */}
        <GoogleButton />
        <div className="flex gap-1">
          <p>Don&apos;t have an account?</p>
          <Link href={'/signup'} className="underline">
            Register
          </Link>
        </div>
      </div>
    </AnimatePageWrapper>
  )
}
