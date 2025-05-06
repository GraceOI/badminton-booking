'use client'

import { Clock } from 'lucide-react'
import { getTimeSlots } from '@/lib/utils'

interface TimeSelectorProps {
  selectedTimeSlot: string | null
  onTimeSelect: (timeSlot: string) => void
  bookedTimeSlots?: string[]
}

export default function TimeSelector({
  selectedTimeSlot,
  onTimeSelect,
  bookedTimeSlots = []
}: TimeSelectorProps) {
  const timeSlots = getTimeSlots()

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Time</h2>
        <p className="text-gray-600">Choose a time slot for your booking</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map((slot) => {
          const isBooked = bookedTimeSlots.includes(slot.value)
          return (
            <div
              key={slot.value}
              className={`
                border rounded-md p-3 text-center transition-colors
                ${isBooked 
                  ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed' 
                  : selectedTimeSlot === slot.value
                    ? 'border-psu-blue bg-blue-50 cursor-pointer'
                    : 'border-gray-200 hover:border-psu-blue cursor-pointer'
                }
              `}
              onClick={() => !isBooked && onTimeSelect(slot.value)}
            >
              <div className="flex items-center justify-center">
                <Clock className={`h-4 w-4 mr-1.5 ${isBooked ? 'text-gray-400' : 'text-psu-blue'}`} />
                <span className={isBooked ? 'text-gray-400' : ''}>
                  {slot.label}
                </span>
              </div>
              {isBooked && (
                <div className="text-xs text-red-500 mt-1">
                  Booked
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <div className="flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-psu-blue mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
    </div>
  )
}