import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function useOpenConversation() {
  const router = useRouter()
  const [openingId, setOpeningId] = useState<string | null>(null)

  const openConversation = async (participantId: string) => {
    try {
      setOpeningId(participantId)
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId }),
      })
      if (!res.ok) throw new Error('Failed to open conversation')
      const conv = await res.json()
      router.push(`/chat/${conv.id}`)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setOpeningId(null)
    }
  }

  return { openConversation, openingId }
}
