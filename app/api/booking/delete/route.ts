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

    // Get booking ID from request
    const data = await req.json()
    const { bookingId } = data

    // Validate input
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      )
    }

    // Delete booking (or mark as cancelled)
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete booking error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}