'use client'

import { MapPin } from 'lucide-react'

interface CourtSelectorProps {
  courts: {
    id: string
    name: string
  }[]
  selectedCourt: string | null
  onCourtSelect: (courtId: string) => void
}

export default function CourtSelector({
  courts,
  selectedCourt,
  onCourtSelect
}: CourtSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Court</h2>
        <p className="text-gray-600">Choose which badminton court you'd like to book</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courts.map((court) => (
          <div
            key={court.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-colors
              ${selectedCourt === court.id 
                ? 'border-psu-blue bg-blue-50' 
                : 'border-gray-200 hover:border-psu-blue'}
            `}
            onClick={() => onCourtSelect(court.id)}
          >
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <MapPin className="h-5 w-5 text-psu-blue" />
              </div>
              <div>
                <div className="font-medium">{court.name}</div>
                <div className="text-sm text-gray-600 mt-1">PSU Badminton Court</div>
              </div>
            </div>
            
            {selectedCourt === court.id && (
              <div className="mt-3 text-xs text-psu-blue">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          Select a court to proceed with your booking. All courts are equipped with standard badminton facilities.
        </p>
      </div>
    </div>
  )
}