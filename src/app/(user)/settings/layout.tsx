import { ReactNode } from 'react'
import SettingsSidebar from '@/components/settings-sidebar'
import AnimatePageWrapper from '@/components/animate-page-wrapper'

export default function SettingsLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <AnimatePageWrapper className="mx-auto text-gray-300 w-full">
      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        <SettingsSidebar />
        <main className="flex-1 p-2">{children}</main>
      </div>
    </AnimatePageWrapper>
  )
}
