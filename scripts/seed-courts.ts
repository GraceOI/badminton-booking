import prisma from '../lib/db'

async function seedCourts() {
  try {
    // Create courts
    const courts = await Promise.all([
      prisma.court.upsert({
        where: { name: 'Court 1' },
        update: {},
        create: { name: 'Court 1' }
      }),
      prisma.court.upsert({
        where: { name: 'Court 2' },
        update: {},
        create: { name: 'Court 2' }
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