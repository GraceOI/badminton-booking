// app/api/debug-login.ts
import prisma from "@/lib/db";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface LoginRequest {
  psuId: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequest = await req.json();
    const { psuId, password } = body;
    
    if (!psuId || !password) {
      return NextResponse.json({ error: 'PSU ID and password are required' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { psuId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found', stage: 'user_lookup' }, { status: 404 });
    }

    // Check password
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: 'Invalid password', 
        stage: 'password_check',
        passwordHashType: user.password.substring(0, 4) // First 4 chars of hash
      }, { status: 401 });
    }

    // Success
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        psuId: user.psuId,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Debug login error:', error);
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({ 
      error: 'Server error', 
      message: errorMessage 
    }, { status: 500 });
  }
}