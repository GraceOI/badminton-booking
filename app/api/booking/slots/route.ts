import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    
    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }
    
    const date = new Date(dateParam);
    
    // Get all time slots
    const timeSlots = await prisma.timeSlot.findMany({
      orderBy: {
        startTime: "asc",
      },
    });
    
    // Get all bookings for the selected date
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
        status: {
          not: "cancelled",
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        court: true,
        timeSlot: true,
      },
    });
    
    // Create available slot data for the frontend
    const slots = [];
    
    for (const timeSlot of timeSlots) {
      // Find bookings for this time slot
      const slotBookings = bookings.filter(
        (        booking: { timeSlotId: any; }) => booking.timeSlotId === timeSlot.id
      );
      
      // Add booked slots
      for (const booking of slotBookings) {
        slots.push({
          courtId: booking.courtId,
          courtName: booking.court.name,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          isAvailable: false,
          username: booking.user.name,
          bookingId: booking.id,
        });
      }
      
      // Add available slots (courts that don't have a booking for this time slot)
      const courts = await prisma.court.findMany();
      
      for (const court of courts) {
        const isBooked = slotBookings.some(
          (          booking: { courtId: any; }) => booking.courtId === court.id
        );
        
        if (!isBooked) {
          slots.push({
            courtId: court.id,
            courtName: court.name,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            isAvailable: true,
            username: null,
            bookingId: null,
          });
        }
      }
    }
    
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching booking slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking slots" },
      { status: 500 }
    );
  }
}