import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get booking data from request
    const data = await req.json()
    const { bookingId, courtId, date, startTime, endTime, status } = data

    // Validate input
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Check if booking exists and belongs to user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id
      }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      )
    }

    // Format the date (remove time component) if provided
    let bookingDate = undefined
    if (date) {
      bookingDate = new Date(date)
      bookingDate.setHours(0, 0, 0, 0)
    }

    // Convert string times to Date objects if needed
    const startTimeDate = startTime ? (typeof startTime === 'string' ? new Date(startTime) : startTime) : undefined
    const endTimeDate = endTime ? (typeof endTime === 'string' ? new Date(endTime) : endTime) : undefined

    // Check for scheduling conflicts if changing court, date, or time
    if ((courtId && courtId !== existingBooking.courtId) || 
        (bookingDate && bookingDate.toDateString() !== existingBooking.date.toDateString()) || 
        (startTimeDate && startTimeDate.toISOString() !== existingBooking.startTime.toISOString())) {
      
      const conflict = await prisma.booking.findFirst({
        where: {
          id: { not: bookingId },
          courtId: courtId || existingBooking.courtId,
          date: bookingDate || existingBooking.date,
          startTime: startTimeDate || existingBooking.startTime,
          status: { not: 'cancelled' }
        }
      })

      if (conflict) {
        return NextResponse.json(
          { error: 'This court is already booked for the selected time' },
          { status: 409 }
        )
      }
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...(courtId && { courtId }),
        ...(bookingDate && { date: bookingDate }),
        ...(startTimeDate && { startTime: startTimeDate }),
        ...(endTimeDate && { endTime: endTimeDate }),
        ...(status && { status }),
      }
    })

    return NextResponse.json({ success: true, booking: updatedBooking })
  } catch (error: any) {
    console.error('Update booking error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}