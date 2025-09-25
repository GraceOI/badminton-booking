import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const { searchParams } = new URL(request.url);
    const courtId = searchParams.get("courtId");
    const date = searchParams.get("date");
    const startTime = searchParams.get("startTime");

    let whereClause: any = {};

    if (courtId) {
      whereClause.courtId = courtId;
    }

    if (date) {
      const bookingDate = new Date(date);
      bookingDate.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      whereClause.date = {
        gte: bookingDate,
        lt: endOfDay,
      };
    }

    if (startTime) {
      const startTimeDate = new Date(`${date}T${startTime}:00`);
      whereClause.startTime = startTimeDate;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            psuId: true,
          }
        },
        court: {
          select: {
            name: true,
          }
        },
        timeSlot: {
          select: {
            startTime: true,
            endTime: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
