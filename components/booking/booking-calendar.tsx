'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format, addDays, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-gray-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, 'PPP') : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
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
        </PopoverContent>
      </Popover>

      {selectedDate && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Selected date: <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </p>
        </div>
      )}
    </div>
  )
}