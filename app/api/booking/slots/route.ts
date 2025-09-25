import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

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
    // Ensure timeslots exist (30-minute slots 08:00-22:00)
    let timeSlots = await prisma.timeSlot.findMany({
      orderBy: {
        startTime: "asc",
      },
    });
    if (timeSlots.length === 0) {
      const baseDate = new Date();
      baseDate.setHours(0, 0, 0, 0);
      const toDateTime = (h: number, m: number) => {
        const d = new Date(baseDate);
        d.setHours(h, m, 0, 0);
        return d;
      };
      const createData: { startTime: Date; endTime: Date }[] = [];
      for (let hour = 8; hour < 22; hour++) {
        createData.push({ startTime: toDateTime(hour, 0), endTime: toDateTime(hour, 30) });
        createData.push({ startTime: toDateTime(hour, 30), endTime: toDateTime(hour + 1, 0) });
      }
      await prisma.timeSlot.createMany({ data: createData });
      timeSlots = await prisma.timeSlot.findMany({ orderBy: { startTime: "asc" } });
    }
    
    // Get all bookings for the selected date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
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
    const slots: Array<{
      courtId: string;
      courtName: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
      username: string | null;
      bookingId: string | null;
    }> = [];

    // Ensure 2 courts
    const courts = await prisma.court.findMany({ orderBy: { name: "asc" } });

    const toHHMM = (d: Date) => {
      const date = new Date(d as any);
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    };

    // Generate slots for all courts and time slots, checking actual bookings
    for (const timeSlot of timeSlots) {
      const startStr = toHHMM(timeSlot.startTime as any);
      const endStr = toHHMM(timeSlot.endTime as any);
      
      for (const court of courts) {
        // Check if this court and time slot is booked
        const existingBooking = bookings.find(booking => 
          booking.courtId === court.id &&
          booking.timeSlot &&
          toHHMM(booking.timeSlot.startTime as any) === startStr &&
          toHHMM(booking.timeSlot.endTime as any) === endStr
        );
        
        slots.push({
          courtId: court.id,
          courtName: court.name,
          startTime: startStr,
          endTime: endStr,
          isAvailable: !existingBooking,
          username: existingBooking ? existingBooking.user.name : null,
          bookingId: existingBooking ? existingBooking.id : null,
        });
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