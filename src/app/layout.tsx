import type { Metadata } from 'next'
import { Atkinson_Hyperlegible } from 'next/font/google'
import { AuthProvider } from '@/components/provider/auth-provider'
import { QueryProvider } from '@/components/provider/query-provider'
import './globals.css'

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-atkinson-hyperlegible',
})

export const metadata: Metadata = {
  title: 'Escape',
  icons: {
    icon: '/logo-light.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${atkinsonHyperlegible.variable} bg-black`}>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
