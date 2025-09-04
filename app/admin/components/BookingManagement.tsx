'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  court: {
    name: string
  }
  user: {
    name: string
    psuId: string
  }
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings')
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleApprove = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/approve`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to approve booking')
      }

      toast.success('Booking approved successfully')
      fetchBookings() // Refresh the list
    } catch (error) {
      console.error('Error approving booking:', error)
      toast.error('Failed to approve booking')
    }
  }

  const handleReject = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/reject`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to reject booking')
      }

      toast.success('Booking rejected successfully')
      fetchBookings() // Refresh the list
    } catch (error) {
      console.error('Error rejecting booking:', error)
      toast.error('Failed to reject booking')
    }
  }

  const handleDelete = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/delete`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete booking')
      }

      toast.success('Booking deleted successfully')
      fetchBookings() // Refresh the list
    } catch (error) {
      console.error('Error deleting booking:', error)
      toast.error('Failed to delete booking')
    }
  }

  if (loading) {
    return <div>Loading bookings...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Booking Management</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>PSU ID</TableHead>
              <TableHead>Court</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell>{booking.user.psuId}</TableCell>
                <TableCell>{booking.court.name}</TableCell>
                <TableCell>{format(new Date(booking.date), 'PPP')}</TableCell>
                <TableCell>
                  {format(new Date(booking.startTime), 'HH:mm')} -{' '}
                  {format(new Date(booking.endTime), 'HH:mm')}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {(booking.status === 'pending' || booking.status === 'upcoming') && (
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(booking.id)}
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(booking.id)}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(booking.id)}
                        className="bg-gray-500 text-white hover:bg-gray-600"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 