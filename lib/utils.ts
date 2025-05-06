import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

export function formatTime(time: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(time))
}

export function getTimeSlots(): { label: string; value: string }[] {
  return [
    { label: "08:00-09:00", value: "08:00-09:00" },
    { label: "09:00-10:00", value: "09:00-10:00" },
    { label: "10:00-11:00", value: "10:00-11:00" },
    { label: "11:00-12:00", value: "11:00-12:00" },
    { label: "12:00-13:00", value: "12:00-13:00" },
    { label: "13:00-14:00", value: "13:00-14:00" },
    { label: "14:00-15:00", value: "14:00-15:00" },
    { label: "15:00-16:00", value: "15:00-16:00" },
    { label: "16:00-17:00", value: "16:00-17:00" },
    { label: "17:00-18:00", value: "17:00-18:00" },
    { label: "18:00-19:00", value: "18:00-19:00" },
    { label: "19:00-20:00", value: "19:00-20:00" },
    { label: "20:00-21:00", value: "20:00-21:00" },
    { label: "21:00-22:00", value: "21:00-22:00" },
  ];
}