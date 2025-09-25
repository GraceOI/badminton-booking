import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Booking statistics
    const [totalBookings, approvedBookings, cancelledBookings, upcomingBookings] = await Promise.all([
      prisma.booking.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      prisma.booking.count({
        where: {
          status: 'approved',
          createdAt: { gte: startDate }
        }
      }),
      prisma.booking.count({
        where: {
          status: 'cancelled',
          createdAt: { gte: startDate }
        }
      }),
      prisma.booking.count({
        where: {
          status: 'upcoming',
          createdAt: { gte: startDate }
        }
      })
    ])
    
    // Daily bookings for the period
    const dailyBookings = await prisma.$queryRaw`
      SELECT DATE(createdAt) as date, COUNT(*) as count
      FROM Booking
      WHERE createdAt >= ${startDate}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    ` as Array<{ date: string; count: number }>
    
    // Court usage statistics
    const courtStats = await prisma.court.findMany({
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                createdAt: { gte: startDate }
              }
            }
          }
        }
      }
    })
    
    // User statistics
    const [totalUsers, newUsersThisMonth, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.user.count({
        where: {
          bookings: {
            some: {
              createdAt: { gte: startDate }
            }
          }
        }
      })
    ])
    
    return NextResponse.json({
      bookingStats: {
        total: totalBookings,
        approved: approvedBookings,
        cancelled: cancelledBookings,
        upcoming: upcomingBookings
      },
      dailyBookings: dailyBookings.map(item => ({
        date: item.date,
        count: Number(item.count)
      })),
      courtStats: courtStats.map(court => ({
        courtName: court.name,
        bookings: court._count.bookings
      })),
      userStats: {
        totalUsers,
        newUsersThisMonth,
        activeUsers
      }
    })
  } catch (error) {
    console.error('Error fetching report data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
