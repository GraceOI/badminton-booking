import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Fetch all stats in parallel
    const [
      totalBookings,
      totalUsers,
      todayBookings,
      approvedBookings,
      pendingBookings,
      cancelledBookings
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.user.count(),
      prisma.booking.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.booking.count({
        where: { status: 'approved' }
      }),
      prisma.booking.count({
        where: { status: 'upcoming' }
      }),
      prisma.booking.count({
        where: { status: 'cancelled' }
      })
    ])
    
    return NextResponse.json({
      totalBookings,
      totalUsers,
      todayBookings,
      approvedBookings,
      pendingBookings,
      cancelledBookings
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}