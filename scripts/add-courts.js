const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addCourts() {
  try {
    const courts = await Promise.all([
      prisma.court.create({
        data: { name: 'Court 1' }
      }),
      prisma.court.create({
        data: { name: 'Court 2' }
      }),
      prisma.court.create({
        data: { name: 'Court 3' }
      }),
      prisma.court.create({
        data: { name: 'Court 4' }
      })
    ])

    console.log('Courts created:', courts)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addCourts() 