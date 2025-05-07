const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        psuId: true,
        isAdmin: true
      }
    });
    
    console.log("Users in database:");
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error listing users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers(); 