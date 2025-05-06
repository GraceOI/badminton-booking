'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { Camera, X } from 'lucide-react'

interface CameraFeedProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
}

export default function CameraFeed({ onCapture, onCancel }: CameraFeedProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  }

  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true)
    setError(null)
  }, [])

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    setIsCameraReady(false)
    setError(typeof error === 'string' ? error : error.message)
  }, [])

  const startCapture = useCallback(() => {
    // Start countdown
    setCountdown(3)
  }, [])

  // Handle countdown
  useEffect(() => {
    if (countdown === null) return

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Capture image when countdown reaches 0
      if (!webcamRef.current) {
        setError('Camera not initialized')
        setCountdown(null)
        return
      }

      const imageSrc = webcamRef.current.getScreenshot()
      if (!imageSrc) {
        setError('Failed to capture image')
        setCountdown(null)
        return
      }

      onCapture(imageSrc)
      setCountdown(null)
    }
  }, [countdown, onCapture])

  return (
    <div className="relative">
      <div className="bg-black rounded-lg overflow-hidden">
        {error ? (
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <p className="text-red-600 mb-2">Camera Error</p>
            <p className="text-sm text-gray-700">{error}</p>
            <p className="text-sm text-gray-600 mt-4">
              Please allow camera access or try a different browser.
            </p>
            <Button 
              onClick={onCancel} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              className="w-full rounded-lg"
              mirrored={true}
            />
            
            {/* Face positioning guide */}
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-dashed border-white/60 rounded-full w-3/5 h-4/5 flex items-center justify-center">
                {countdown !== null && (
                  <div className="bg-black/50 rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">{countdown}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <Button 
          onClick={onCancel} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Cancel
        </Button>
        
        <Button
          onClick={startCapture}
          disabled={!isCameraReady || countdown !== null}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
          size="sm"
        >
          <Camera className="h-4 w-4" /> {countdown !== null ? 'Capturing...' : 'Capture Photo'}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        Position your face within the outline for best recognition results.
      </p>
    </div>
  )
}