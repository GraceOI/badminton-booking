// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminNavbar from "@/components/AdminNavbar";
import BookingChart from "@/components/admin/BookingChart";
import AdminStats from "@/components/admin/AdminStats";
import RecentBookings from "@/components/admin/RecentBookings";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    bookingsToday: 0,
    bookingsThisMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบสิทธิ์ Admin
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !session?.user?.isAdmin) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        if (response.ok) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.isAdmin) {
      fetchStats();
    }
  }, [status, session]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStats 
            title="Total Users" 
            value={stats.totalUsers} 
            icon="users" 
            trend={11.01} 
            isUp={true} 
          />
          <AdminStats 
            title="Total Bookings" 
            value={stats.totalBookings} 
            icon="calendar" 
            trend={9.05} 
            isUp={false} 
          />
          <AdminStats 
            title="Today's Bookings" 
            value={stats.bookingsToday} 
            icon="today" 
            trend={5.0} 
            isUp={true} 
          />
          <AdminStats 
            title="This Month" 
            value={stats.bookingsThisMonth} 
            icon="chart" 
            trend={10.0} 
            isUp={true} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Monthly Bookings</h2>
              <select className="border rounded p-1 text-sm">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <BookingChart />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Monthly Target</h2>
              <button className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="10" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="62.8" 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold">75.55%</p>
                    <p className="text-green-500 text-sm">+10%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600 mb-4">
              <p>Target bookings for this month: 100</p>
              <p>Current bookings: 76</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-500">Target</p>
                <p className="font-semibold">100</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-500">Current</p>
                <p className="font-semibold">76</p>
              </div>
              
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
            <RecentBookings />
          </div>
        </div>
      </div>
    </div>
  );
}