import { Booking } from "@prisma/client";

export interface Court {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingWithUser extends Booking {
  user: {
    id: string;
    name: string;
    email: string | null;
    psuId: string;
  };
  court: Court;
}

export interface BookingWithUserAndCourt extends Booking {
  user: {
    id: string;
    name: string;
    email: string | null;
    psuId: string;
  };
  court: Court;
  timeSlot: TimeSlot;
}

// ปรับปรุง types เดิม
declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    psuId: string;
    faceRegistered: boolean;
    isAdmin: boolean; // เพิ่มสิทธิ์ Admin
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      psuId: string;
      faceRegistered: boolean;
      isAdmin: boolean; // เพิ่มสิทธิ์ Admin
    }
  }
}