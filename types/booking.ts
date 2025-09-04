export interface BookingSlot {
  courtId: string;
  courtName: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  username: string | null;
  bookingId: string | null;
}

export interface Court {
  id: string;
  name: string;
  description?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: string;
  userId: string;
  courtId: string;
  timeSlotId: string;
  date: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface BookingWithUser extends Booking {
  endTime: string | number | Date;
  startTime: string | number | Date;
  user: {
    name: string;
  };
  court: Court;
  timeSlot: TimeSlot;
}
export interface BookingWithUserAndCourt extends Booking {
  user: {
    name: string;
  };
  court: Court;
  timeSlot: TimeSlot;
}