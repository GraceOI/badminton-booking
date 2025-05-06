import prisma from '../lib/db'

async function main() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('Database connection successful')

    // List all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        psuId: true,
        name: true,
        faceRegistered: true,
      },
    })

    console.log('Users in database:', users)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 