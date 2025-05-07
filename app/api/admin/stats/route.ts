// app/api/admin/stats/route.ts (continued)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // ตรวจสอบว่าเป็น admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // นับจำนวนผู้ใช้ทั้งหมด
    const totalUsers = await prisma.user.count();
    
    // นับจำนวนการจองทั้งหมด
    const totalBookings = await prisma.booking.count();
    
    // นับจำนวนการจองวันนี้
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const bookingsToday = await prisma.booking.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    
    // นับจำนวนการจองเดือนนี้
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    const bookingsThisMonth = await prisma.booking.count({
      where: {
        date: {
          gte: firstDayOfMonth,
          lt: firstDayOfNextMonth,
        },
      },
    });
    
    return NextResponse.json({
      totalUsers,
      totalBookings,
      bookingsToday,
      bookingsThisMonth,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}