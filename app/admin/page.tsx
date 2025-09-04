// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminNavbar from "@/components/AdminNavbar";
import BookingChart from "@/components/admin/BookingChart";
import AdminStats from "@/components/admin/AdminStats";
import RecentBookings from "@/components/admin/RecentBookings";
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import BookingManagement from './components/BookingManagement'
import AdminDashboardClient from './components/AdminDashboardClient'

export default function AdminDashboard() {
  return <AdminDashboardClient />
}