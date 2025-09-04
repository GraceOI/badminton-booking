"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createBooking(data: {
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return { success: false, message: "You must be logged in to book a court" };
    }
    
    // Convert date and time strings to Date objects
    const bookingDate = new Date(data.date);
    
    // Get the time slot
    const timeSlot = await prisma.timeSlot.findFirst({
      where: {
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
    
    if (!timeSlot) {
      return { success: false, message: "Invalid time slot" };
    }
    
    // Check if the court is already booked for this time slot
    const existingBooking = await prisma.booking.findFirst({
      where: {
        courtId: data.courtId,
        date: bookingDate,
        timeSlotId: timeSlot.id,
        status: {
          not: "cancelled",
        },
      },
    });
    
    if (existingBooking) {
      return { success: false, message: "This court is already booked for the selected time" };
    }
    
    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        courtId: data.courtId,
        timeSlotId: timeSlot.id,
        date: bookingDate,
        startTime: timeSlot.startTime, // 👈 เพิ่ม
        endTime: timeSlot.endTime, 
        status: "upcoming",
      },
    });
    
    // Revalidate booking paths
    revalidatePath("/booking");
    revalidatePath("/bookings");
    
    return { success: true, booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, message: "Failed to create booking" };
  }
}