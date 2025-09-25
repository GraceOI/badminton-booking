import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE() {
  try {
    // Delete all cancelled bookings
    const deleteResult = await prisma.booking.deleteMany({
      where: {
        status: 'cancelled'
      }
    });
    
    console.log('Deleted cancelled bookings:', deleteResult);

    return NextResponse.json({ 
      success: true, 
      message: 'Cancelled bookings cleared',
      deletedCount: deleteResult.count 
    });
  } catch (error) {
    console.error("Error clearing cancelled bookings:", error);
    return NextResponse.json(
      { error: "Failed to clear cancelled bookings" },
      { status: 500 }
    );
  }
}
