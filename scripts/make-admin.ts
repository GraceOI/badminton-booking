import { prisma } from "@/lib/db";

async function makeAdmin(email: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });
    
    console.log("User updated successfully:", updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Replace with your email
const email = "your.email@example.com";
makeAdmin(email); 