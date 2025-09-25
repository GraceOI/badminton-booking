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
    const { courtId, date, startTime, endTime } = data

    // Validate input
    if (!courtId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the date (remove time component)
    const bookingDate = new Date(date)
    bookingDate.setHours(0, 0, 0, 0)

    // Convert string times to Date objects
    // For time strings like "08:00", create proper Date objects
    const startTimeDate = typeof startTime === 'string' 
      ? new Date(`${date}T${startTime}:00`) 
      : startTime
    const endTimeDate = typeof endTime === 'string' 
      ? new Date(`${date}T${endTime}:00`) 
      : endTime

    // Check if court exists
    const court = await prisma.court.findUnique({
      where: { id: courtId }
    })

    if (!court) {
      return NextResponse.json(
        { error: 'Court not found' },
        { status: 404 }
      )
    }

    // Check for existing bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        courtId,
        date: bookingDate,
        startTime: startTimeDate,
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This court is already booked for the selected time' },
        { status: 409 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        courtId,
        date: bookingDate,
        startTime: startTimeDate,
        endTime: endTimeDate,
        status: 'approved',
        bookingDate: new Date()
      }
    })

    return NextResponse.json({ success: true, booking })
  } catch (error: any) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}