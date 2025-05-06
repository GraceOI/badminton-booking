'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import CourtSelector from './court-selector'
import BookingCalendar from './booking-calendar'
import TimeSelector from './time-selector'
import BookingConfirmation from './booking-confirmation'
import { createBooking } from '@/lib/actions/booking-actions'

interface BookingFormProps {
  userId: string
  courts: {
    id: string
    name: string
  }[]
}

export default function BookingForm({ userId, courts }: BookingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCourtSelection = (courtId: string) => {
    setSelectedCourt(courtId)
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleTimeSelection = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleNext = () => {
    if (step === 1 && !selectedCourt) {
      setError('Please select a court')
      return
    }

    if (step === 2 && !selectedDate) {
      setError('Please select a date')
      return
    }

    if (step === 3 && !selectedTimeSlot) {
      setError('Please select a time slot')
      return
    }

    setError(null)
    setStep(step + 1)
  }

  const handleBack = () => {
    setError(null)
    setStep(step - 1)
  }

  const handleConfirmBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedTimeSlot) {
      setError('Please complete all booking details')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Parse time slot for start and end times
      const [startTimeStr, endTimeStr] = selectedTimeSlot.split('-')
      const [startHour, startMinute] = startTimeStr.split(':').map(Number)
      const [endHour, endMinute] = endTimeStr.split(':').map(Number)
      
      // Create Date objects for start and end times
      const startTime = new Date(selectedDate!)
      startTime.setHours(startHour, startMinute, 0)
      
      const endTime = new Date(selectedDate!)
      endTime.setHours(endHour, endMinute, 0)
      
      // Call server action to create booking
      const result = await createBooking({
        userId,
        courtId: selectedCourt,
        date: selectedDate!,
        startTime,
        endTime
      })

      if (!result.success) {
        setError(result.error || 'Booking failed')
        return
      }

      // Redirect to dashboard after successful booking
      router.push('/dashboard?bookingSuccess=true')
    } catch (err: any) {
      console.error('Booking error:', err)
      setError(err.message || 'An error occurred during booking')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  const selectedCourtName = selectedCourt ? 
    courts.find(court => court.id === selectedCourt)?.name || '' : ''

  // Parse time slot for creating confirmation dates
  const getTimeDate = (timeStr: string) => {
    if (!selectedDate || !selectedTimeSlot) return new Date()
    
    const [hour, minute] = timeStr.split(':').map(Number)
    const date = new Date(selectedDate)
    date.setHours(hour, minute, 0)
    return date
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {step === 1 && (
        <CourtSelector 
          courts={courts} 
          selectedCourt={selectedCourt} 
          onCourtSelect={handleCourtSelection} 
        />
      )}
      
      {step === 2 && (
        <BookingCalendar 
          selectedDate={selectedDate} 
          onDateChange={handleDateChange} 
        />
      )}
      
      {step === 3 && (
        <TimeSelector 
          selectedTimeSlot={selectedTimeSlot} 
          onTimeSelect={handleTimeSelection} 
        />
      )}
      
      {step === 4 && selectedTimeSlot && (
        <BookingConfirmation 
          courtName={selectedCourtName}
          date={selectedDate!} 
          startTime={getTimeDate(selectedTimeSlot.split('-')[0])}
          endTime={getTimeDate(selectedTimeSlot.split('-')[1])}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      )}

      {step < 4 && (
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            className="bg-psu-blue"
          >
            {step === 3 ? 'Review Booking' : 'Next'}
          </Button>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === step ? 'bg-psu-blue' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}