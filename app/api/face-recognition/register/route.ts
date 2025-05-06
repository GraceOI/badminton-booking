import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get face image data from request
    const data = await req.json()
    const { imageData } = data

    // Validate input
    if (!imageData) {
      return NextResponse.json(
        { error: 'Face image data is required' },
        { status: 400 }
      )
    }

    // Get base64 data from the image string (remove the data:image/jpeg;base64, part)
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // In a real implementation, we would use face_recognition or DeepFace here
    // to extract face encodings from the image
    // For simulation purposes, we'll create a mock face encoding
    const mockFaceEncoding = Buffer.from(JSON.stringify({
      encoding: Array.from({ length: 128 }, () => Math.random())
    }))

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: { faceData: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create or update face data
    let faceData
    if (user.faceData) {
      faceData = await prisma.faceData.update({
        where: { id: user.faceData.id },
        data: {
          faceImage: buffer,
          faceData: mockFaceEncoding,
          updatedAt: new Date()
        }
      })
    } else {
      faceData = await prisma.faceData.create({
        data: {
          userId: user.id,
          faceImage: buffer,
          faceData: mockFaceEncoding
        }
      })
    }

    // Update user's face registration status
    await prisma.user.update({
      where: { id: user.id },
      data: { faceRegistered: true }
    })

    return NextResponse.json({ 
      success: true,
      faceRegistered: true
    })
  } catch (error: any) {
    console.error('Face registration error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during face registration' },
      { status: 500 }
    )
  }
}