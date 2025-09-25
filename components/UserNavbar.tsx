import Link from "next/link";

export default function UserNavbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold">PSU Booking</h1>
      <div className="space-x-4">
        <Link href="/booking">Booking</Link>
        <Link href="/my-bookings">My Bookings</Link>
        <Link href="/profile">Profile</Link>
      </div>
    </nav>
  );
}
