// components/admin/RecentBookings.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { BookingWithUser } from "@/types/booking";

export default function RecentBookings() {
  const [bookings, setBookings] = useState<BookingWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const response = await fetch("/api/admin/bookings?limit=5");
        const data = await response.json();
        if (response.ok) {
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentBookings();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return <p className="text-gray-500 text-center py-4">No recent bookings</p>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{booking.id.substring(0, 8)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {booking.user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {booking.court.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(booking.date), "dd/MM/yyyy")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  booking.status === "upcoming" 
                    ? "bg-blue-100 text-blue-800" 
                    : booking.status === "completed" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Link 
                  href={`/admin/bookings/${booking.id}`} 
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  View
                </Link>
                <Link 
                  href={`/admin/bookings/edit/${booking.id}`} 
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 flex justify-end">
        <Link 
          href="/admin/bookings" 
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          View All Bookings →
        </Link>
      </div>
    </div>
  );
}