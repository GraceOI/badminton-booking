import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
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
