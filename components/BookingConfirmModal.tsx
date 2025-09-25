"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useBookingAlerts } from "@/components/alerts/AlertSystem";
import { createBooking } from "@/action/booking";

interface BookingConfirmModalProps {
  date: Date;
  courtId: string;
  courtName: string;
  startTime: string;
  endTime: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BookingConfirmModal({
  date,
  courtId,
  courtName,
  startTime,
  endTime,
  onClose,
  onConfirm
}: BookingConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { showBookingSuccess, showBookingError } = useBookingAlerts();
  
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Format date and times for API
      const formattedDate = format(date, "yyyy-MM-dd");
      
      // Call the server action to create a booking
      const result = await createBooking({
        courtId,
        date: formattedDate,
        startTime,
        endTime,

      });
      
      if (result.success) {
        // Booking successfully created
        onConfirm();
        // Show success alert
        showBookingSuccess(courtName, format(date, "PPP"), `${startTime} - ${endTime}`);
        setTimeout(() => {
          router.push("/my-bookings");
        }, 2000);
      } else {
        const errorMessage = result.message || "Failed to create booking";
        setError(errorMessage);
        showBookingError(errorMessage);
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">Court:</div>
            <div className="font-medium">{courtName}</div>
            
            <div className="text-gray-600">Date:</div>
            <div className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</div>
            
            <div className="text-gray-600">Time:</div>
            <div className="font-medium">{startTime} - {endTime}</div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
            disabled={isLoading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}