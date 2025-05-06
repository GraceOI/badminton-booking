import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PSU Badminton Court Access System',
  description: 'Book badminton courts at Prince of Songkla University',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}