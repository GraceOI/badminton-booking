// Create this file at: app/api/courts/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Ensure at least 2 courts exist
    const count = await prisma.court.count()
    if (count === 0) {
      await prisma.court.createMany({
        data: [
          { name: 'Court 1' },
          { name: 'Court 2' }
        ],
        skipDuplicates: true
      })
    }

    // Fetch all courts from database
    const courts = await prisma.court.findMany({
      select: {
        id: true,
        name: true
      }
    })

    return NextResponse.json(courts)
  } catch (error) {
    console.error('Error fetching courts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courts' },
      { status: 500 }
    )
  }
}