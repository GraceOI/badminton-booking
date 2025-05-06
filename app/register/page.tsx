'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { registerUser } from '@/lib/actions/auth-actions'

export default function RegisterPage() {
  const [psuId, setPsuId] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!psuId || !name || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const result = await registerUser({
        psuId,
        name,
        password
      })

      if (!result.success) {
        setError(result.error || 'Registration failed')
        return
      }

      // Registration successful, redirect to login
      router.push('/login?registered=true')
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'An error occurred during registration')
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
            <h1 className="text-2xl font-bold text-center">Create PSU Badminton Account</h1>
            <p className="text-gray-600 text-center mt-1">Register with your PSU Passport</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-psu-blue focus:border-psu-blue"
                placeholder="Enter your full name"
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
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-psu-blue focus:border-psu-blue"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full bg-psu-blue hover:bg-blue-700" 
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-psu-blue hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}