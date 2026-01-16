import Link from 'next/link'
import AnimatePageWrapper from '@/components/animate-page-wrapper'
import { GoogleButton } from '@/components/buttons/google-button'

interface AuthCardProps {
  title: string[]
  children: React.ReactNode
  footerText: string
  footerLinkText: string
  footerLinkHref: string
  showSocialAuth?: boolean
}

export function AuthCard({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  showSocialAuth = true,
}: AuthCardProps) {
  return (
    <AnimatePageWrapper className="max-md:px-2 flex bg-light-gray text-gray-300 flex-col gap-2 items-center py-10 lg:py-32 min-h-screen">
      <div className="max-w-lg flex items-center justify-center flex-col gap-3 w-full">
        {/* Dynamic Title Header */}
        <div className="flex flex-col text-4xl py-2 gap-1 w-full font-light">
          {title.map((line, i) => (
            <h1 key={i}>{line}</h1>
          ))}
        </div>

        {/* Form Content */}
        {children}

        {/* Social Auth Section */}
        {showSocialAuth && (
          <>
            <div>or</div>
            <GoogleButton />
          </>
        )}

        {/* Footer Link */}
        <div className="flex gap-1">
          <p>{footerText}</p>
          <Link href={footerLinkHref} className="underline hover:text-white transition-colors">
            {footerLinkText}
          </Link>
        </div>
      </div>
    </AnimatePageWrapper>
  )
}