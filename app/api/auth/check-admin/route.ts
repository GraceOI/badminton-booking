// app/api/auth/check-admin/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
    
    // ส่งข้อมูลสถานะ admin และ faceRegistered กลับไป
    return NextResponse.json({
      isAuthenticated: true,
      isAdmin: session.user.isAdmin || false,
      faceRegistered: session.user.faceRegistered || false
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}