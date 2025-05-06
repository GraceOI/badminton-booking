'use client'

import { format } from 'date-fns'
import { Check, Calendar, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookingConfirmationProps {
  courtName: string
  date: Date
  startTime: Date
  endTime: Date
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function BookingConfirmation({
  courtName,
  date,
  startTime,
  endTime,
  onConfirm,
  onCancel,
  isLoading = false
}: BookingConfirmationProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Confirm Your Booking</h2>
        <p className="text-gray-600 mt-1">
          Please review your booking details before confirming
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-psu-blue mt-0.5 mr-3" />
          <div>
            <p className="font-medium">{courtName}</p>
            <p className="text-sm text-gray-600">PSU Badminton Court</p>
          </div>
        </div>

        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-psu-blue mt-0.5 mr-3" />
          <div>
            <p className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-sm text-gray-600">Booking Date</p>
          </div>
        </div>

        <div className="flex items-start">
          <Clock className="h-5 w-5 text-psu-blue mt-0.5 mr-3" />
          <div>
            <p className="font-medium">
              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
            </p>
            <p className="text-sm text-gray-600">Time Slot</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <p className="text-sm text-gray-600 mb-4">
          By confirming this booking, you agree to the court usage policies and cancellation terms.
        </p>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-psu-green hover:bg-green-600"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Confirm Booking
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}