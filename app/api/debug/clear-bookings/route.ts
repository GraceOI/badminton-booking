import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE() {
  try {
    // Find duplicate bookings based on unique constraint
    const duplicateBookings = await prisma.booking.groupBy({
      by: ['courtId', 'date', 'startTime'],
      having: {
        courtId: {
          _count: {
            gt: 1
          }
        }
      }
    });

    console.log('Found duplicate bookings:', duplicateBookings);

    // Delete all bookings to start fresh
    const deleteResult = await prisma.booking.deleteMany({});
    
    console.log('Deleted all bookings:', deleteResult);

    return NextResponse.json({ 
      success: true, 
      message: 'All bookings cleared',
      deletedCount: deleteResult.count 
    });
  } catch (error) {
    console.error("Error clearing bookings:", error);
    return NextResponse.json(
      { error: "Failed to clear bookings" },
      { status: 500 }
    );
  }
}
