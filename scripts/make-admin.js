const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin(psuId) {
  try {
    const updatedUser = await prisma.user.update({
      where: { psuId },
      data: { isAdmin: true },
    });
    
    console.log("User updated successfully:", updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// The exact PSU ID from the database
const psuId = "009878890";
makeAdmin(psuId); 