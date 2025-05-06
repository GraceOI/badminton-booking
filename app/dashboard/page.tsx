'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/dashboard");
    }
  }, [status, router])

  // Redirect to face registration if user hasn't registered their face
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !session.user.faceRegistered) {
      router.push('/face-registration')
    }
  }, [session, status, router])

  // Show loading state
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psu-blue mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
            <p className="text-gray-600 mt-1">Access your PSU badminton court bookings</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-psu-blue mr-2" />
                <h2 className="text-xl font-bold">Book a Court</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Schedule your badminton session at your preferred time.
              </p>
              <Link href="/booking">
                <Button className="w-full bg-psu-blue hover:bg-blue-700">
                  Book Now
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-psu-blue mr-2" />
                <h2 className="text-xl font-bold">My Bookings</h2>
              </div>
              <p className="text-gray-600 mb-6">
                View your upcoming and past court reservations.
              </p>
              <Link href="/my-bookings">
                <Button variant="outline" className="w-full border-psu-blue text-psu-blue hover:bg-blue-50">
                  View Bookings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Prince of Songkla University. All rights reserved.
        </div>
      </footer>
    </div>
  )
}