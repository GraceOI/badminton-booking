import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ['approved', 'upcoming']
        }
      },
      include: {
        court: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      courtName: booking.court.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      date: booking.date,
      status: booking.status
    }))

    return NextResponse.json(formattedBookings)
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
