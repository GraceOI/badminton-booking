'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-psu-blue text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-psu-blue rounded-full w-10 h-10 flex items-center justify-center font-bold">
              PSU
            </div>
            <h1 className="text-xl font-bold">PSU Badminton Court Access System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="secondary">Log in</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="bg-white text-psu-blue hover:bg-gray-100">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow grid place-items-center bg-gray-50">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-4">Access control System For A Badminton Court</h2>
                  <p className="text-gray-600 mb-6">
                    This website is designed to test the use of booking fields within the university. 
                    To make a booking, register and login using your PSU Passport.
                  </p>
                  <div className="space-x-4">
                    <Link href="/register">
                      <Button className="bg-psu-blue hover:bg-blue-700">
                        Register Now
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="border-psu-blue text-psu-blue hover:bg-blue-50">
                        Login
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="bg-gray-200 relative min-h-[300px]">
                  <div className="absolute inset-0">
                    <Image 
                      src="/images/psu-badminton1.jpg" 
                      alt="PSU Badminton Court" 
                      width={600} 
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4">How to use</h3>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-blue-100 text-psu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    1
                  </div>
                  <h4 className="font-medium mb-2">Register</h4>
                  <p className="text-gray-600 text-sm">
                    Sign up with your PSU Passport ID and details
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-blue-100 text-psu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    2
                  </div>
                  <h4 className="font-medium mb-2">Login</h4>
                  <p className="text-gray-600 text-sm">
                    Sign in with your PSU Passport ID and password
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-blue-100 text-psu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    3
                  </div>
                  <h4 className="font-medium mb-2">Face Registration</h4>
                  <p className="text-gray-600 text-sm">
                    Register your face to get access to the court booking system
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-blue-100 text-psu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    4
                  </div>
                  <h4 className="font-medium mb-2">Book a Court</h4>
                  <p className="text-gray-600 text-sm">
                    Select your preferred court, date, and time slot
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Prince of Songkla University. All rights reserved.
        </div>
      </footer>
    </div>
  )
}





