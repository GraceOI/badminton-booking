// app/admin/bookings/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminNavbar from "@/components/AdminNavbar";
import { BookingWithUserAndCourt } from "@/types/booking";
import { Court, TimeSlot } from "@/types/booking";
import { format } from "date-fns";

export default function EditBooking({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;
  
  const [booking, setBooking] = useState<BookingWithUserAndCourt | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    courtId: "",
    date: "",
    timeSlotId: "",
    status: "",
  });
  
  useEffect(() => {
    // ตรวจสอบสิทธิ์ Admin
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !session?.user?.isAdmin) {
      router.push("/dashboard");
    }
  }, [session, status, router]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // ดึงข้อมูลการจอง
        const bookingRes = await fetch(`/api/admin/bookings/${id}`);
        
        if (!bookingRes.ok) {
          throw new Error("Failed to fetch booking");
        }
        
        const bookingData = await bookingRes.json();
        setBooking(bookingData);
        
        // ดึงข้อมูลสนาม
        const courtsRes = await fetch("/api/courts");
        
        if (!courtsRes.ok) {
          throw new Error("Failed to fetch courts");
        }
        
        const courtsData = await courtsRes.json();
        setCourts(courtsData);
        
        // ดึงข้อมูล time slots
        const timeSlotsRes = await fetch("/api/timeslots");
        
        if (!timeSlotsRes.ok) {
          throw new Error("Failed to fetch time slots");
        }
        
        const timeSlotsData = await timeSlotsRes.json();
        setTimeSlots(timeSlotsData);
        
        // กำหนดค่าเริ่มต้นให้ form
        setFormData({
          courtId: bookingData.courtId,
          date: format(new Date(bookingData.date), "yyyy-MM-dd"),
          timeSlotId: bookingData.timeSlotId,
          status: bookingData.status,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("ไม่สามารถดึงข้อมูลได้");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (status === "authenticated" && session?.user?.isAdmin) {
      fetchData();
    }
  }, [id, status, session]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update booking");
      }
      
      alert("การจองถูกอัปเดตเรียบร้อยแล้ว");
      router.push("/admin/bookings");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("ไม่สามารถอัปเดตการจองได้");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-center text-gray-500">ไม่พบข้อมูลการจอง</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Booking</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Back
          </button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Booking Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking ID
                  </label>
                  <input
                    type="text"
                    value={booking.id}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <input
                    type="text"
                    value={booking.user.name}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Court
                  </label>
                  <select
                    name="courtId"
                    value={formData.courtId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Court</option>
                    {courts.map((court) => (
                      <option key={court.id} value={court.id}>
                        {court.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    name="timeSlotId"
                    value={formData.timeSlotId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.startTime} - {slot.endTime}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border rounded-md mr-4 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}