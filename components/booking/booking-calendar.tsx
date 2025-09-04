'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

interface BookingCalendarProps {
  selectedDate: Date | undefined
  onDateChange: (date: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
}

export default function BookingCalendar({
  selectedDate,
  onDateChange,
  minDate = new Date(),
  maxDate = addDays(new Date(), 30)
}: BookingCalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Date
      </label>
      
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-gray-400"
          )}
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, 'PPP') : "Pick a date"}
        </Button>

        {isCalendarOpen && (
          <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-2 border-b">
              <h3 className="font-medium">Select Date</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCalendarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  onDateChange(date)
                  setIsCalendarOpen(false)
                }}
                disabled={(date) => {
                  // Disable dates before today
                  return date < new Date(minDate.setHours(0, 0, 0, 0)) || 
                         date > maxDate
                }}
                initialFocus
              />
            </div>
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Selected date: <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </p>
        </div>
      )}
      
      {/* Backdrop to close calendar when clicking outside */}
      {isCalendarOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsCalendarOpen(false)}
        />
      )}
    </div>
  )
}