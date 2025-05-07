// app/api/admin/bookings/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // ตรวจสอบว่าเป็น admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // ดึงข้อมูลการจองตาม ID
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        court: true,
        timeSlot: true,
      },
    });
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // ตรวจสอบว่าเป็น admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const data = await req.json();
    
    // ตรวจสอบว่ามีการจองนี้
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });
    
    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    
    // อัปเดตการจอง
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        courtId: data.courtId,
        date: data.date ? new Date(data.date) : undefined,
        timeSlotId: data.timeSlotId,
        status: data.status,
      },
    });
    
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // ตรวจสอบว่าเป็น admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // ตรวจสอบว่ามีการจองนี้
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });
    
    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    
    // ลบการจอง
    await prisma.booking.delete({
      where: { id },
    });
    
    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}