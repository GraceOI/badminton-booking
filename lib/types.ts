// Type definitions for the application

// Extend NextAuth session types
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      psuId?: string | null
      faceRegistered?: boolean
    }
  }

  interface User {
    id: string
    name: string
    psuId: string
    faceRegistered: boolean
  }
}

// Booking types
export interface BookingFormData {
  courtId: string
  date: Date
  timeSlot: string
}

export interface Booking {
  id: string
  userId: string
  courtId: string
  court: Court
  date: Date
  startTime: Date
  endTime: Date
  status: 'upcoming' | 'completed' | 'cancelled'
  bookingDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface Court {
  id: string
  name: string
}

// User types
export interface User {
  id: string
  psuId: string
  name: string
  faceRegistered: boolean
  faceData?: FaceData
  createdAt: Date
  updatedAt: Date
}

export interface FaceData {
  id: string
  userId: string
  faceImage: Buffer
  faceData: Buffer
  createdAt: Date
  updatedAt: Date
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}