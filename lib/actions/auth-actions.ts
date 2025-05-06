'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { hash, compare } from 'bcryptjs'

// Login user action
export async function loginUser(psuId: string, password: string) {
  try {
    // Validate inputs
    if (!psuId || !password) {
      return { success: false, error: 'PSU ID and password are required' }
    }

    // Find user by PSU ID
    const user = await prisma.user.findUnique({
      where: { psuId }
    })

    if (!user) {
      return { success: false, error: 'Invalid PSU ID or password' }
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid PSU ID or password' }
    }

    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        psuId: user.psuId,
        faceRegistered: user.faceRegistered
      }
    }
  } catch (error) {
    return { success: false, error: 'An error occurred while logging in' }
  }
}

// Register user action
export async function registerUser(data: { psuId: string; name: string; password: string }) {
  try {
    const { psuId, name, password } = data

    // Validate inputs
    if (!psuId || !name || !password) {
      return { success: false, error: 'All fields are required' }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { psuId }
    })

    if (existingUser) {
      return { success: false, error: 'PSU ID already registered' }
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create new user
    const user = await prisma.user.create({
      data: {
        psuId,
        name,
        password: hashedPassword,
      },
    })

    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        psuId: user.psuId,
        faceRegistered: user.faceRegistered
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'An error occurred during registration' }
  }
}