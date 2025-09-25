"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
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
    
    // Resolve time slot by matching HH:MM strings against stored DateTimes
    const allTimeSlots = await prisma.timeSlot.findMany();
    const toHHMM = (d: Date) => {
      const dt = new Date(d as any);
      const h = String(dt.getHours()).padStart(2, '0');
      const m = String(dt.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    };
    const timeSlot = allTimeSlots.find(ts => toHHMM(ts.startTime as any) === data.startTime && toHHMM(ts.endTime as any) === data.endTime);
    
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
    
    // Get user ID from session
    const userId = (session.user as any).id
    if (!userId) {
      return { success: false, message: "User ID not found in session" };
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        courtId: data.courtId,
        timeSlotId: timeSlot.id,
        date: bookingDate,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime, 
        status: "approved",
      },
    });
    
    // Revalidate booking paths
    revalidatePath("/booking");
    revalidatePath("/my-bookings");
    
    return { success: true, booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, message: "Failed to create booking" };
  }
}