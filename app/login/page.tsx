'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LoginPage() {
  const [psuId, setPsuId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user was redirected after registration
  useEffect(() => {
    const registered = searchParams.get('registered')
    if (registered === 'true') {
      setSuccessMessage('Registration successful! Please log in with your credentials.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!psuId || !password) {
      setError('Please enter both PSU ID and password')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')
      
      const result = await signIn('credentials', {
        redirect: false,
        psuId,
        password,
      })

      if (result?.error) {
        setError('Invalid PSU ID or password')
        return
      }

      // Redirect to face registration if login successful
      router.push('/face-registration')
    } catch (err: any) {
      console.error('Login error:', err)
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-psu-blue text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mb-2">
              PSU
            </div>
            <h1 className="text-2xl font-bold text-center">PSU Badminton Court Access</h1>
            <p className="text-gray-600 text-center mt-1">Login with PSU Passport</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="psuId" className="block text-sm font-medium text-gray-700">
                PSU Passport ID
              </label>
              <input
                id="psuId"
                name="psuId"
                type="text"
                required
                value={psuId}
                onChange={(e) => setPsuId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-psu-blue focus:border-psu-blue"
                placeholder="Enter your PSU ID"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-psu-blue focus:border-psu-blue"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full bg-psu-blue hover:bg-blue-700" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-psu-blue hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}