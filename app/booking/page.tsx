"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format, addDays, subDays } from "date-fns";
import Navbar from "@/components/AdminNavbar";
import { BookingSlot } from "@/types/booking";
import BookingConfirmModal from "@/components/BookingConfirmModal";

export default function BookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    courtId: string;
    startTime: string;
    endTime: string;
    courtName: string;
  } | null>(null);
  
  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  
  // Fetch booking slots for the selected date
  useEffect(() => {
    if (status === "authenticated") {
      fetchBookingSlots();
    }
  }, [selectedDate, status]);
  
  const fetchBookingSlots = async () => {
    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await fetch(`/api/booking/slots?date=${formattedDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking slots');
      }
      
      const data = await response.json();
      setBookingSlots(data.slots);
    } catch (error) {
      console.error("Error fetching booking slots:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };
  
  const goPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };
  
  const goNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };
  
  const handleSlotClick = (courtId: string, startTime: string, endTime: string, courtName: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    
    setSelectedSlot({
      courtId,
      startTime,
      endTime,
      courtName
    });
    
    setShowConfirmModal(true);
  };
  
  const handleConfirmBooking = () => {
    // Will be handled in the confirmation modal
    setShowConfirmModal(false);
  };
  
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Generate time slots from 8:00 to 22:00
  const timeSlots = [];
  for (let hour = 8; hour < 22; hour++) {
    timeSlots.push({
      start: `${hour.toString().padStart(2, '0')}:00`,
      end: `${hour.toString().padStart(2, '0')}:30`
    });
    
    timeSlots.push({
      start: `${hour.toString().padStart(2, '0')}:30`,
      end: `${(hour + 1).toString().padStart(2, '0')}:00`
    });
  }
  
  // Define court names
  const courts = [
    { id: "1", name: "Court 1" },
    { id: "2", name: "Court 2" },
    { id: "3", name: "Court 3" },
    { id: "4", name: "Court 4" }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              value={format(selectedDate, "yyyy-MM-dd")}
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
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="min-w-full">
            {timeSlots.map((timeSlot, index) => {
              // Find booking data for this time slot
              const slotBookings = bookingSlots.filter(
                slot => slot.startTime === timeSlot.start && slot.endTime === timeSlot.end
              );
              
              return (
                <div key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="flex">
                    <div className="w-40 py-4 px-6 border-r flex items-center">
                      <span className="font-medium">{timeSlot.start}</span>
                      <span className="mx-2">—</span>
                      <span className="font-medium">{timeSlot.end}</span>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-4">
                      {courts.map(court => {
                        // Check if this court is booked for this time slot
                        const booking = slotBookings.find(slot => slot.courtId === court.id);
                        const isAvailable = !booking;
                        
                        return (
                          <div
                            key={court.id}
                            onClick={() => handleSlotClick(court.id, timeSlot.start, timeSlot.end, court.name, isAvailable)}
                            className={`
                              border-r last:border-r-0 p-4 text-center
                              ${isAvailable 
                                ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer'
                                : 'bg-red-100'}
                            `}
                          >
                            <div className="font-medium text-blue-900 mb-1">
                              {court.name}
                            </div>
                            <div className={`text-sm ${isAvailable ? 'text-blue-700' : 'text-red-700'}`}>
                              {isAvailable ? "Available" : booking?.username}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
  );
}