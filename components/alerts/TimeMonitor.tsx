'use client'

import { useEffect, useState } from 'react'
import { useBookingAlerts } from './AlertSystem'

interface Booking {
  id: string
  courtName: string
  startTime: string
  endTime: string
  date: string
  status: string
}

interface TimeMonitorProps {
  bookings: Booking[]
}

export function TimeMonitor({ bookings }: TimeMonitorProps) {
  const { showTimeWarning } = useBookingAlerts()
  const [checkedBookings, setCheckedBookings] = useState<Set<string>>(new Set())
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())

  useEffect(() => {
    const checkUpcomingBookings = () => {
      const now = new Date()
      setLastUpdateTime(now)
      
      bookings.forEach(booking => {
        if (booking.status !== 'approved' && booking.status !== 'upcoming') return
        
        const bookingDateTime = new Date(`${booking.date}T${booking.startTime}`)
        const timeDiff = bookingDateTime.getTime() - now.getTime()
        const minutesUntilStart = Math.floor(timeDiff / (1000 * 60))
        
        // Check if booking starts soon (within 15 minutes)
        if (minutesUntilStart <= 15 && minutesUntilStart > 0) {
          if (!checkedBookings.has(booking.id)) {
            showTimeWarning(booking.courtName, minutesUntilStart)
            setCheckedBookings(prev => new Set(prev).add(booking.id))
          }
        }
        
        // Check if booking is ending soon
        const endDateTime = new Date(`${booking.date}T${booking.endTime}`)
        const timeUntilEnd = endDateTime.getTime() - now.getTime()
        const minutesUntilEnd = Math.floor(timeUntilEnd / (1000 * 60))
        
        if (minutesUntilEnd <= 10 && minutesUntilEnd > 0) {
          const warningId = `${booking.id}-ending`
          if (!checkedBookings.has(warningId)) {
            showTimeWarning(`${booking.courtName} (ending)`, minutesUntilEnd)
            setCheckedBookings(prev => new Set(prev).add(warningId))
          }
        }
      })
    }

    // Check every 30 seconds for more responsive updates
    const interval = setInterval(checkUpcomingBookings, 30000)
    
    // Initial check
    checkUpcomingBookings()

    return () => clearInterval(interval)
  }, [bookings, showTimeWarning, checkedBookings])

  return null // This component doesn't render anything
}

// Hook for getting user's upcoming bookings
export function useUpcomingBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date())

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/user/bookings', {
          cache: 'no-store', // Ensure fresh data
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
          setLastFetchTime(new Date())
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
    
    // Refresh every 2 minutes for more real-time updates
    const interval = setInterval(fetchBookings, 120000)
    
    return () => clearInterval(interval)
  }, [])

  return { bookings, loading, lastFetchTime }
}
