'use client'

import { SessionProvider } from 'next-auth/react'
import { AlertProvider } from '@/components/alerts/AlertSystem'

type ProvidersProps = {
  children: React.ReactNode
  session: any
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <AlertProvider>
        {children}
      </AlertProvider>
    </SessionProvider>
  )
}