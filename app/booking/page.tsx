'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format, addDays, subDays } from 'date-fns'
import Navbar from '@/components/UserNavbar'
import { BookingSlot, Court } from '@/types/booking'
import BookingConfirmModal from '@/components/BookingConfirmModal'

export default function BookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([])
  const [courts, setCourts] = useState<Court[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{
    courtId: string
    startTime: string
    endTime: string
    courtName: string
  } | null>(null)
  
  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])
  
  // Fetch courts and booking slots
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCourts()
      fetchBookingSlots()
    }
  }, [selectedDate, status])
  
  const fetchCourts = async () => {
    try {
      const response = await fetch('/api/courts')
      if (!response.ok) throw new Error('Failed to fetch courts')
      const data = await response.json()
      setCourts(Array.isArray(data) ? data.slice(0, 2) : [])
    } catch (e) {
      console.error('Error fetching courts:', e)
      setCourts([
        { id: 'fallback-1', name: 'Court 1' },
        { id: 'fallback-2', name: 'Court 2' },
      ])
    }
  }
  
  const fetchBookingSlots = async () => {
    setIsLoading(true)
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd')
      const response = await fetch(`/api/booking/slots?date=${formattedDate}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking slots')
      }
      
      const data = await response.json()
      setBookingSlots(data.slots)
    } catch (error) {
      console.error('Error fetching booking slots:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value))
  }
  
  const goPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1))
  }
  
  const goNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1))
  }
  
  const handleSlotClick = (courtId: string, startTime: string, endTime: string, courtName: string, isAvailable: boolean) => {
    if (!isAvailable) return
    
    setSelectedSlot({
      courtId,
      startTime,
      endTime,
      courtName
    })
    
    setShowConfirmModal(true)
  }
  
  const handleConfirmBooking = () => {
    setShowConfirmModal(false)
  }
  
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Generate time slots from 8:00 to 22:00
  const timeSlots: Array<{ start: string; end: string }> = []
  for (let hour = 8; hour < 22; hour++) {
    timeSlots.push({
      start: `${hour.toString().padStart(2, '0')}:00`,
      end: `${hour.toString().padStart(2, '0')}:30`
    })
    
    timeSlots.push({
      start: `${hour.toString().padStart(2, '0')}:30`,
      end: `${(hour + 1).toString().padStart(2, '0')}:00`
    })
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">BOOKING</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={goPreviousDay}
              className="p-2 border rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={goNextDay}
              className="p-2 border rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <select className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="badminton">Badminton</option>
          </select>
        </div>
        
        {/* Vertical Court Layout */}
        <div className="space-y-6">
          {courts.map((court) => (
            <div key={court.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">{court.name}</h2>
                <p className="text-blue-100">PSU Badminton Court</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {timeSlots.map((timeSlot, index) => {
                    // Find booking data for this court and time slot
                    const slotData = bookingSlots.find(
                      slot => 
                        slot.courtId === court.id && 
                        slot.startTime === timeSlot.start && 
                        slot.endTime === timeSlot.end
                    )
                    
                    const isAvailable = slotData ? slotData.isAvailable : true
                    const bookedBy = slotData && !slotData.isAvailable ? slotData.username : null
                    
                    return (
                      <div
                        key={index}
                        onClick={() => handleSlotClick(court.id, timeSlot.start, timeSlot.end, court.name, isAvailable)}
                        className={`
                          p-3 rounded-lg border-2 text-center cursor-pointer transition-all duration-200
                          ${isAvailable 
                            ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300' 
                            : 'border-red-200 bg-red-50 cursor-not-allowed'
                          }
                        `}
                      >
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {timeSlot.start}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {timeSlot.end}
                        </div>
                        <div className={`text-xs font-medium ${
                          isAvailable 
                            ? 'text-blue-600' 
                            : 'text-red-600'
                        }`}>
                          {isAvailable ? 'Available' : bookedBy}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showConfirmModal && selectedSlot && (
        <BookingConfirmModal
          date={selectedDate}
          courtName={selectedSlot.courtName}
          startTime={selectedSlot.startTime}
          endTime={selectedSlot.endTime}
          courtId={selectedSlot.courtId}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  )
}