'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { Camera, Check } from 'lucide-react'
import { registerFace } from '@/lib/actions/face-recognition-actions'

export default function FaceRegistrationPage() {
  const { data: session, status } = useSession()
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const webcamRef = useRef<Webcam>(null)

  // Check if user is already face registered
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.faceRegistered) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleStartFaceRecognition = () => {
    setIsCameraActive(true)
  }

  const handleSkip = () => {
    // User can skip but won't be able to book courts
    router.push('/dashboard')
  }

  const handleCapture = async () => {
    try {
      setIsCapturing(true)
      setError(null)
      
      if (!webcamRef.current) {
        throw new Error('Camera not initialized')
      }

      const imageSrc = webcamRef.current.getScreenshot()
      if (!imageSrc) {
        throw new Error('Failed to capture image')
      }

      if (!session?.user) {
        throw new Error('User not authenticated')
      }

      // Debug: Log session data
      console.log('Session data:', session)
      console.log('User data:', session.user)

      // Get user identifier from session
      const userIdentifier = session.user.id
      console.log('User identifier:', userIdentifier)
      
      if (!userIdentifier) {
        throw new Error('User identifier not found in session')
      }

      // Call server action to register face
      const result = await registerFace(userIdentifier, imageSrc)

      if (result.success) {
        setRegistrationComplete(true)
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setError(result.error || 'Face registration failed')
      }
    } catch (err: any) {
      console.error('Face registration error:', err)
      setError(err.message || 'An error occurred during face registration')
    } finally {
      setIsCapturing(false)
    }
  }

  // If loading or not authenticated
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psu-blue mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Verify Face Registration</h1>
            {!isCameraActive && !registrationComplete && (
              <p className="text-gray-600 mt-2">
                The system detected that you have not registered your face to access the badminton court. 
                Please register your face. It only takes a few seconds and you only need to do it once.
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {registrationComplete ? (
            <div className="text-center">
              <div className="bg-green-100 p-8 rounded-lg mb-6">
                <div className="success-icon mx-auto bg-psu-green rounded-full w-20 h-20 flex items-center justify-center">
                  <Check className="text-white h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold mt-4">Access Granted!</h2>
                <p className="mt-2">Welcome to PSU Badminton Court, {session?.user?.name}.</p>
                <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard in 3 seconds...</p>
              </div>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full bg-psu-blue"
              >
                Return to Homepage
              </Button>
            </div>
          ) : isCameraActive ? (
            <div className="text-center">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                <div className="aspect-w-4 aspect-h-3">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: "user"
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="mb-4 text-gray-600">Please position your face within the frame for identification.</p>
              <Button 
                onClick={handleCapture}
                disabled={isCapturing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isCapturing ? 'Processing...' : 'Start Face Scan'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleStartFaceRecognition}
                className="w-full bg-psu-green text-white flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Face Recognition
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="w-full text-gray-600"
              >
                Skip
              </Button>
              <p className="text-xs text-red-500 text-center">
                Note: If you skip, you won't be able to book courts
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}