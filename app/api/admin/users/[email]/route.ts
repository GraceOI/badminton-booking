import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = params;
    
    // Update user's admin status
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
} 