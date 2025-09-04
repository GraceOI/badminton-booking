import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { psuId, name, password } = await req.json()

    if (!psuId || !name || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { psuId } })
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 409 })
    }

    // ✅ แก้ตรงนี้! เข้ารหัสรหัสผ่านก่อนเก็บ
    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: {
        psuId,
        name,
        password: hashedPassword,
        isAdmin: false,
        faceRegistered: false,
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
