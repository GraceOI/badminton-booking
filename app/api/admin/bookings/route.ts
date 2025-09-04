// app/api/admin/bookings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const bookings = await prisma.booking.findMany({
      include: {
        court: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            psuId: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}