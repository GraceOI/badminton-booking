'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { getUserBookings, cancelBooking } from '@/lib/actions/booking-actions'
import { ArrowLeft, Clock, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatTime } from '@/lib/utils'

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  bookingDate: string
  court: {
    id: string
    name: string
  }
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('upcoming')
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Redirect to face registration if user hasn't registered their face
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !session.user.faceRegistered) {
      router.push('/face-registration')
    }
  }, [session, status, router])

  // Fetch user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setLoading(true)
          const result = await getUserBookings(session.user.id)
          
          if (result.success && result.bookings) {
            setBookings(result.bookings as unknown as Booking[])
          } else {
            setError(result.error || 'Failed to load bookings')
          }
        } catch (err: any) {
          console.error('Error fetching bookings:', err)
          setError(err.message || 'An error occurred while fetching bookings')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchBookings()
  }, [session, status])

  const handleCancelBooking = async (bookingId: string) => {
    if (!session?.user?.id) return
    
    try {
      const result = await cancelBooking(bookingId, session.user.id)
      
      if (result.success) {
        // Update bookings list
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        ))
      } else {
        setError(result.error || 'Failed to cancel booking')
      }
    } catch (err: any) {
      console.error('Error cancelling booking:', err)
      setError(err.message || 'An error occurred while cancelling booking')
    }
  }

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return booking.status === 'upcoming' || booking.status === 'approved'
    } else if (activeTab === 'completed') {
      return booking.status === 'completed'
    } else if (activeTab === 'cancelled') {
      return booking.status === 'cancelled'
    } else {
      return true // All bookings
    }
  })

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
        <div className="container mx-auto max-w-3xl">
          <div className="mb-6 flex items-center">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">My Bookings</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b">
              <div className="flex">
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'upcoming'
                      ? 'border-b-2 border-psu-blue text-psu-blue'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'completed'
                      ? 'border-b-2 border-psu-blue text-psu-blue'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'cancelled'
                      ? 'border-b-2 border-psu-blue text-psu-blue'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('cancelled')}
                >
                  Cancelled
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'all'
                      ? 'border-b-2 border-psu-blue text-psu-blue'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('all')}
                >
                  All Bookings
                </button>
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-psu-blue mx-auto"></div>
                  <p className="mt-2">Loading bookings...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No {activeTab} bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.court.name}</h3>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(new Date(booking.date))}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {formatTime(new Date(booking.startTime))} - {formatTime(new Date(booking.endTime))}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'upcoming' || booking.status === 'approved'
                                ? 'bg-blue-100 text-blue-800'
                                : booking.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Booked on: {formatDate(new Date(booking.bookingDate))}
                      </div>
                      
                      {(booking.status === 'upcoming' || booking.status === 'approved') && (
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      
                      {booking.status === 'completed' && (
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-psu-green text-psu-green hover:bg-green-50"
                          >
                            Book Again
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 border-t border-gray-200 mt-auto">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Prince of Songkla University. All rights reserved.
        </div>
      </footer>
    </div>
  )
}