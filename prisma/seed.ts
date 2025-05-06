// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // สร้างคอร์ท
  const courts = await Promise.all([
    prisma.court.upsert({
      where: { name: 'Court 1' },
      update: {},
      create: {
        name: 'Court 1',
      },
    }),
    prisma.court.upsert({
      where: { name: 'Court 2' },
      update: {},
      create: {
        name: 'Court 2',
      },
    }),
  ])

  console.log('Courts created:')
  console.log(courts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })