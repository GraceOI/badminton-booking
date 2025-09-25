'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'

interface BookingData {
  userId: string
  courtId: string
  date: Date
  startTime: Date
  endTime: Date
}

export async function createBooking(data: BookingData) {
  try {
    // Validate inputs
    if (!data.userId || !data.courtId || !data.date || !data.startTime || !data.endTime) {
      return { success: false, error: 'Missing required booking data' }
    }

    // Format the date (remove time component)
    const bookingDate = new Date(data.date)
    bookingDate.setHours(0, 0, 0, 0)

    // Check for existing bookings at the same time
    const existingBooking = await prisma.booking.findFirst({
        where: {
          courtId: data.courtId,
          date: bookingDate,
          startTime: data.startTime,
        }
      })

    if (existingBooking) {
      return { 
        success: false, 
        error: 'This court is already booked for the selected time' 
      }
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: data.userId,
        courtId: data.courtId,
        date: bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        status: 'approved',
        bookingDate: new Date()
      }
    })

    revalidatePath('/booking')
    revalidatePath('/my-bookings')
    
    return { success: true, booking }
  } catch (error: any) {
    console.error('Booking creation error:', error)
    return { 
      success: false, 
      error: error.message || 'An error occurred while creating the booking' 
    }
  }
}

export async function getUserBookings(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' }
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId
      },
      orderBy: {
        date: 'asc'
      },
      include: {
        court: true
      }
    })

    return { success: true, bookings }
  } catch (error: any) {
    console.error('Get bookings error:', error)
    return { 
      success: false, 
      error: error.message || 'An error occurred while fetching bookings' 
    }
  }
}

export async function cancelBooking(bookingId: string, userId: string) {
  try {
    if (!bookingId || !userId) {
      return { success: false, error: 'Booking ID and user ID are required' }
    }

    // Check if booking exists and belongs to the user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId
      }
    })

    if (!booking) {
      return { success: false, error: 'Booking not found or access denied' }
    }

    // Update booking status to cancelled
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' }
    })

    revalidatePath('/my-bookings')
    
    return { success: true }
  } catch (error: any) {
    console.error('Cancel booking error:', error)
    return { 
      success: false, 
      error: error.message || 'An error occurred while cancelling the booking' 
    }
  }
}