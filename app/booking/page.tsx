'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { format, addDays } from 'date-fns'
import { createBooking } from '@/lib/actions/booking-actions'
import { getCourts } from '@/lib/actions/court-actions'
import { Check } from 'lucide-react'

interface Court {
  id: string
  name: string
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export default function BookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // เพิ่มข้อมูลคอร์ทเริ่มต้น (default courts) เพื่อให้มีข้อมูลแสดงเสมอ
  const defaultCourts: Court[] = [
    { id: 'court-1', name: 'Court 1' },
    { id: 'court-2', name: 'Court 2' }
  ]
  
  const [courts, setCourts] = useState<Court[]>(defaultCourts)
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
    '20:00-21:00', '21:00-22:00'
  ]

  // Fetch courts from database
  useEffect(() => {
    async function fetchCourts() {
      try {
        const result = await getCourts()
        if (result.success && result.courts && result.courts.length > 0) {
          setCourts(result.courts)
        } else {
          console.log('Using default courts as no courts returned from API')
          // ถ้า API ไม่ส่งข้อมูลกลับมา ยังคงใช้ค่าเริ่มต้น (ไม่ต้องทำอะไรเพราะเราตั้งค่าเริ่มต้นไว้แล้ว)
        }
      } catch (err) {
        console.error('Error fetching courts:', err)
        setError('Failed to load courts, using default options')
        // ในกรณีที่เกิดข้อผิดพลาด ยังคงใช้ค่าเริ่มต้น
      }
    }
    fetchCourts()
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/booking')
    }
  }, [status, router])

  // Redirect to face registration if user hasn't registered their face
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !session.user.faceRegistered) {
      router.push('/face-registration')
    }
  }, [session, status, router])

  // Generate the next 30 days for date selection
  const generateDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      dates.push(addDays(today, i))
    }
    
    return dates
  }

  const handleBooking = async () => {
    if (!session?.user?.id || !selectedCourt || !selectedDate || !selectedTime) {
      setError('Please select court, date, and time')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Parse time slot for start and end times
      const [startTimeStr, endTimeStr] = selectedTime.split('-')
      const [startHour, startMinute] = startTimeStr.split(':').map(Number)
      const [endHour, endMinute] = endTimeStr.split(':').map(Number)
      
      // Create Date objects for start and end times
      const startTime = new Date(selectedDate)
      startTime.setHours(startHour, startMinute, 0)
      
      const endTime = new Date(selectedDate)
      endTime.setHours(endHour, endMinute, 0)
      
      // Call server action to create booking
      const result = await createBooking({
        userId: session.user.id,
        courtId: selectedCourt,
        date: selectedDate,
        startTime,
        endTime
      })

      if (result.success) {
        setBookingComplete(true)
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        setError(result.error || 'Booking failed')
      }
      
    } catch (err: any) {
      console.error('Booking error:', err)
      setError(err.message || 'An error occurred during booking')
    } finally {
      setLoading(false)
    }
  }

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
          {bookingComplete ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-green-100 p-8 rounded-lg mb-6">
                <div className="success-icon mx-auto bg-psu-green rounded-full w-20 h-20 flex items-center justify-center">
                  <Check className="text-white h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold mt-4">Booking Successful!</h2>
                <p className="mt-2">Redirecting to dashboard...</p>
              </div>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-psu-blue"
              >
                Return to Homepage
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Book a Court</h1>
                <p className="text-gray-600 mt-1">Select your preferred court, date, and time</p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Select Court</h2>
                <div className="grid grid-cols-2 gap-4">
                  {courts.map(court => (
                    <div 
                      key={court.id}
                      className={`
                        border rounded-md p-4 cursor-pointer transition-colors
                        ${selectedCourt === court.id ? 'border-psu-blue bg-blue-50' : 'border-gray-200 hover:border-psu-blue'}
                      `}
                      onClick={() => setSelectedCourt(court.id)}
                    >
                      <div className="font-medium">{court.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Select Date</h2>
                <div className="grid grid-cols-7 gap-2">
                  {generateDates().map((date, index) => (
                    <div 
                      key={index}
                      className={`
                        border rounded-md p-2 text-center cursor-pointer transition-colors
                        ${selectedDate && date.toDateString() === selectedDate.toDateString() 
                          ? 'border-psu-blue bg-blue-50' 
                          : 'border-gray-200 hover:border-psu-blue'}
                      `}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="text-xs text-gray-500">{format(date, 'EEE')}</div>
                      <div className="font-medium">{format(date, 'd')}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Select Time</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {timeSlots.map((time, index) => (
                    <div 
                      key={index}
                      className={`
                        border rounded-md p-2 text-center cursor-pointer transition-colors
                        ${selectedTime === time ? 'border-psu-blue bg-blue-50' : 'border-gray-200 hover:border-psu-blue'}
                      `}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleBooking}
                className="w-full bg-psu-blue hover:bg-blue-700"
                disabled={loading || !selectedCourt || !selectedDate || !selectedTime}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </>
          )}
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