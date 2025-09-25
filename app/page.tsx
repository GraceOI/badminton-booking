'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Users, Shield, Clock, Star, ArrowRight, BadgeCheck } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showRedirectMessage, setShowRedirectMessage] = useState(false)

  // Show redirect message for admin users but don't auto-redirect
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.isAdmin) {
      setShowRedirectMessage(true)
    }
  }, [status, session])

  const handleAdminRedirect = () => {
    router.push('/admin')
  }

  const handleDashboardRedirect = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-md">
                PSU
              </div>
              <div>
                <h1 className="text-xl font-bold">PSU Badminton Court</h1>
                <p className="text-blue-100 text-sm">Smart Access Control System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {status === 'authenticated' ? (
                <>
                  <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                    <BadgeCheck className="h-4 w-4" />
                    <span className="text-sm font-medium">{session?.user?.name}</span>
                  </div>
                  <Link href="/dashboard">
                    <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20">
                      <Calendar className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/api/auth/signout">
                    <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white">
                      Logout
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 shadow-md">
                      <Users className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Admin Message */}
      {showRedirectMessage && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-amber-800">Admin Access Detected</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      You have administrative privileges. Choose your destination:
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleAdminRedirect} 
                      size="sm" 
                      className="bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                    <Button 
                      onClick={handleDashboardRedirect} 
                      size="sm" 
                      variant="outline" 
                      className="border-amber-500 text-amber-600 hover:bg-amber-50"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      User Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto py-16 px-6">
          {/* Hero Section */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="grid lg:grid-cols-2">
                <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                      <Star className="h-4 w-4 mr-2" />
                      Smart Court Management
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      Access Control System For A Badminton Court
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      Experience the future of court booking with our intelligent access control system. 
                      Register with your PSU Passport and enjoy seamless court reservations.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {status === 'authenticated' ? (
                      <>
                        <Link href="/dashboard" className="block">
                          <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                            <Calendar className="h-5 w-5 mr-3" />
                            Go to Dashboard
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </Button>
                        </Link>
                        <Link href="/booking" className="block">
                          <Button size="lg" variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-md transform hover:scale-105 transition-all duration-200">
                            <Clock className="h-5 w-5 mr-3" />
                            Book a Court Now
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/register" className="block">
                          <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                            <Users className="h-5 w-5 mr-3" />
                            Register Now
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </Button>
                        </Link>
                        <Link href="/login" className="block">
                          <Button size="lg" variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-md transform hover:scale-105 transition-all duration-200">
                            <Shield className="h-5 w-5 mr-3" />
                            Login to Your Account
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="relative min-h-[500px] bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0">
                    <Image 
                      src="/images/psu-badminton1.jpg" 
                      alt="PSU Badminton Court" 
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">PSU Badminton Court</h3>
                      <p className="text-sm text-gray-600">State-of-the-art facilities for students and staff</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced How to Use Section */}
            <div className="mt-20">
              <div className="text-center mb-16">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Get started with our smart court booking system in just a few simple steps
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3 text-gray-900">1. Register</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Sign up with your PSU Passport ID and personal details to create your account
                  </p>
                </div>
                
                <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3 text-gray-900">2. Login</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Sign in securely with your PSU Passport ID and password to access the system
                  </p>
                </div>
                
                <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BadgeCheck className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3 text-gray-900">3. Face Registration</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Register your face using our advanced biometric system for secure access
                  </p>
                </div>
                
                <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3 text-gray-900">4. Book a Court</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Select your preferred court, date, and time slot for your badminton session
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  PSU
                </div>
                <div>
                  <h3 className="font-bold text-lg">PSU Badminton Court</h3>
                  <p className="text-gray-400 text-sm">Smart Access Control</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Advanced court booking system designed for Prince of Songkla University students and staff.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/booking" className="block text-gray-400 hover:text-white transition-colors">
                  Book a Court
                </Link>
                <Link href="/my-bookings" className="block text-gray-400 hover:text-white transition-colors">
                  My Bookings
                </Link>
                <Link href="/dashboard" className="block text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>Prince of Songkla University</p>
                <p>Hat Yai, Songkhla 90110</p>
                <p>Thailand</p>
                <p className="text-sm">© {new Date().getFullYear()} All rights reserved</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              Built with Next.js, NextAuth.js, and Prisma for modern web experience
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}