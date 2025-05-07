// app/api/admin/bookings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // ตรวจสอบว่าเป็น admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // รับ query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status") || "";
    const search = url.searchParams.get("search") || "";
    
    // คำนวณ pagination
    const skip = (page - 1) * limit;
    
    // สร้าง filter object สำหรับ where clause
    const filter: any = {};
    
    // กรองตาม status
    if (status && status !== "all") {
      filter.status = status;
    }
    
    // กรองตามข้อความค้นหา
    if (search) {
      filter.OR = [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          court: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          id: {
            contains: search,
          },
        },
      ];
    }
    
    // ดึงข้อมูลการจองพร้อมข้อมูลผู้ใช้และสนาม
    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where: filter,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              psuId: true,
            },
          },
          court: true,
          timeSlot: true,
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.booking.count({
        where: filter,
      }),
    ]);
    
    // คำนวณจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      bookings,
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}