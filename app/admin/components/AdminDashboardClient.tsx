'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import BookingManagement from './BookingManagement'

export default function AdminDashboardClient() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      console.log('Session data:', session)
      
      if (!session?.user?.isAdmin) {
        console.log('User is not admin, redirecting to dashboard')
        router.push('/dashboard')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  console.log('Current session:', session)

  if (!session?.user?.isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <BookingManagement />
    </div>
  )
} 