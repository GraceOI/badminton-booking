'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <header className="bg-psu-blue text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-white text-psu-blue rounded-full w-10 h-10 flex items-center justify-center font-bold">
            PSU
          </div>
          <h1 className="text-xl font-bold">
            <Link href={session ? '/dashboard' : '/'}>
              PSU Badminton Court Access System
            </Link>
          </h1>
        </div>
        
        {session ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white text-psu-blue rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">
                {session.user?.name?.charAt(0) || 'N'}
              </div>
              <span>{session.user?.name || 'User'}</span>
            </div>
            <Button 
              variant="destructive" 
              className="bg-red-600" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
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
        )}
      </div>
    </header>
  )
}