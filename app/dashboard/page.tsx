'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen, Clock, TrendingUp, Users, Activity } from 'lucide-react'
import Link from 'next/link'
import { TimeMonitor, useUpcomingBookings } from '@/components/alerts/TimeMonitor'
import { getUserBookings } from '@/lib/actions/booking-actions'
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { bookings, lastFetchTime } = useUpcomingBookings()
  
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/login");
    }
  }, [status, router])

  // Redirect based on user status
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (session.user.isAdmin) {
        router.push('/admin')
      } else if (!session.user.faceRegistered) {
        router.push('/face-registration')
      }
    }
  }, [session, status, router])

  // Fetch user's bookings and calculate stats
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setLoading(true)
          const result = await getUserBookings(session.user.id)
          
          if (result.success && result.bookings) {
            const bookings = result.bookings as unknown as Booking[]
            setAllBookings(bookings)
            
            // Calculate stats
            const totalBookings = bookings.length
            const upcomingBookings = bookings.filter(b => 
              b.status === 'upcoming' || b.status === 'approved'
            ).length
            const completedBookings = bookings.filter(b => 
              b.status === 'completed'
            ).length
            const cancelledBookings = bookings.filter(b => 
              b.status === 'cancelled'
            ).length
            
            setStats({
              totalBookings,
              upcomingBookings,
              completedBookings,
              cancelledBookings
            })
          }
        } catch (error) {
          console.error('Error fetching bookings:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserBookings()
  }, [session, status])

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
      <TimeMonitor bookings={bookings} />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Welcome back, {session?.user?.name}!</h1>
                <p className="text-gray-600 mt-2 text-lg">Manage your PSU badminton court bookings</p>
              </div>
              {lastFetchTime && (
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                  Last updated: {lastFetchTime.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Upcoming</p>
                  <p className="text-3xl font-bold">{stats.upcomingBookings}</p>
                </div>
                <Clock className="h-8 w-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold">{stats.completedBookings}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Cancelled</p>
                  <p className="text-3xl font-bold">{stats.cancelledBookings}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Book a Court</h2>
                  <p className="text-gray-600">Schedule your badminton session</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Reserve your preferred court and time slot for your next badminton game.
              </p>
              <Link href="/booking">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-lg">
                  Book Now
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                  <p className="text-gray-600">View your reservations</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Check your upcoming bookings, view history, and manage your reservations.
              </p>
              <Link href="/my-bookings">
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 py-3 text-lg font-semibold rounded-lg">
                  View Bookings
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Bookings */}
          {!loading && allBookings.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
                  <Link href="/my-bookings">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {allBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.court.name}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(new Date(booking.date))} • {formatTime(new Date(booking.startTime))} - {formatTime(new Date(booking.endTime))}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'upcoming' || booking.status === 'approved'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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