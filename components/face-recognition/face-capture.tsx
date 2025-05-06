'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Check, RefreshCcw } from 'lucide-react'
import CameraFeed from './camera-feed'

interface FaceCaptureProps {
  onCapture: (imageData: string) => void
  onSkip?: () => void
}

export default function FaceCapture({ onCapture, onSkip }: FaceCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const handleStartCapture = () => {
    setIsCameraActive(true)
    setCapturedImage(null)
  }

  const handleCancelCapture = () => {
    setIsCameraActive(false)
  }

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData)
    setIsCameraActive(false)
  }

  const handleConfirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setIsCameraActive(true)
  }

  if (capturedImage) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden bg-black">
          <img 
            src={capturedImage} 
            alt="Captured face" 
            className="w-full h-auto"
          />
        </div>
        <div className="flex justify-between">
          <Button
            onClick={handleRetake}
            variant="outline"
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" /> Retake
          </Button>
          <Button
            onClick={handleConfirmCapture}
            className="bg-psu-green hover:bg-green-600 flex items-center gap-1"
          >
            <Check className="h-4 w-4" /> Confirm
          </Button>
        </div>
      </div>
    )
  }

  if (isCameraActive) {
    return (
      <CameraFeed
        onCapture={handleImageCapture}
        onCancel={handleCancelCapture}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Camera className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Face Recognition</h3>
        <p className="text-gray-600 text-sm mb-4">
          Please position your face within the frame for identification.
        </p>
      </div>
      
      <Button
        onClick={handleStartCapture}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Start Face Scan
      </Button>
      
      {onSkip && (
        <Button
          onClick={onSkip}
          variant="outline"
          className="w-full text-gray-600"
        >
          Skip
        </Button>
      )}
    </div>
  )
}