'use client'

import ChatLeftSidebar from '@/components/chat/chat-left-sidebar'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isChatRoot = pathname === '/chat'
  const isChatDetail = pathname?.startsWith('/chat/')

  return (
    <div className="page-gradient text-gray-300 h-screen">
      <div className="mx-auto h-full grid max-w-6xl grid-cols-1 py-0 md:py-4 md:grid-cols-3">
        <div
          className={`md:col-span-1 p-2 py-1 overflow-auto ${
            isChatRoot ? '' : 'hidden'
          } md:block`}
        >
          <ChatLeftSidebar />
        </div>
        <main
          className={`md:col-span-2 h-full overflow-hidden bg-dark-gray-2/40 ${
            isChatDetail ? '' : 'hidden'
          } md:block`}
        >
          {isChatDetail && (
            <div className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-3 py-2 border-b border-dark-gray-2 bg-dark-gray-2/60 backdrop-blur">
              <button
                type="button"
                onClick={() => router.push('/chat')}
                className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-dark-gray-hover"
                aria-label="Back to conversations"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
