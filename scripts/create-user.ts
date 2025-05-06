import { hash } from 'bcryptjs'
import prisma from '../lib/db'

async function createUser(psuId: string, name: string, password: string) {
  try {
    const hashedPassword = await hash(password, 12)
    
    const user = await prisma.user.create({
      data: {
        psuId,
        name,
        password: hashedPassword,
      },
    })
    
    console.log('User created successfully:', user)
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Replace these values with your actual data
createUser('your-psu-id', 'Your Name', 'your-password') 