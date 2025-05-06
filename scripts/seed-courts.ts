import prisma from '../lib/db'

async function seedCourts() {
  try {
    // Create courts
    const courts = await Promise.all([
      prisma.court.create({
        data: {
          name: 'Court 1'
        }
      }),
      prisma.court.create({
        data: {
          name: 'Court 2'
        }
      }),
      prisma.court.create({
        data: {
          name: 'Court 3'
        }
      }),
      prisma.court.create({
        data: {
          name: 'Court 4'
        }
      })
    ])

    console.log('Courts created successfully:', courts)
  } catch (error) {
    console.error('Error creating courts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCourts() 