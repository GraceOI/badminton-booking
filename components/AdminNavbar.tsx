// components/AdminNavbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function AdminNavbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarIcon },
    { name: "Users", href: "/admin/users", icon: UserGroupIcon },
    { name: "Reports", href: "/admin/reports", icon: ChartBarIcon },
    { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
  ];
  
  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") {
      return true;
    }
    return pathname?.startsWith(path) && path !== "/admin";
  };
  
  return (
    <div className="bg-indigo-700 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="font-bold text-xl">PSU Admin</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-500"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            {session && (
              <div className="flex items-center space-x-4">
                <span className="hidden md:block">{session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-indigo-700 px-3 py-1 rounded text-white text-sm hover:bg-indigo-800"
                >
                  Logout
                </button>
              </div>
            )}
            
            <button
              type="button"
              className="ml-4 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.href)
                  ? "bg-indigo-700 text-white"
                  : "text-indigo-100 hover:bg-indigo-500"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}