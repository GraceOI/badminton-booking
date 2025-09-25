'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Booking {
  id: string
  userId: string
  courtId: string
  date: string
  startTime: string
  endTime: string
  status: string
  user: {
    name: string
    psuId: string
  }
  court: {
    name: string
  }
  timeSlot?: {
    startTime: string
    endTime: string
  }
}

export default function DebugBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/debug/bookings')
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearAllBookings = async () => {
    if (!confirm('Are you sure you want to clear all bookings? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/debug/clear-bookings', {
        method: 'DELETE'
      })
      const result = await response.json()
      
      if (result.success) {
        alert(`Successfully cleared ${result.deletedCount} bookings`)
        fetchBookings()
      } else {
        alert('Failed to clear bookings')
      }
    } catch (error) {
      console.error('Error clearing bookings:', error)
      alert('Error clearing bookings')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Debug Bookings</h1>
          <div className="space-x-4">
            <Button onClick={fetchBookings} variant="outline">
              Refresh
            </Button>
            <Button onClick={clearAllBookings} variant="destructive">
              Clear All Bookings
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Bookings ({bookings.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Court
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {booking.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{booking.user.name}</div>
                        <div className="text-gray-500">{booking.user.psuId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.court.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {bookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No bookings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
