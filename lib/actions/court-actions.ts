'use server'

import { prisma } from '@/lib/db'

// สร้างคอร์ทเริ่มต้นถ้ายังไม่มีในฐานข้อมูล
async function ensureDefaultCourts() {
  // ตรวจสอบจำนวนคอร์ททั้งหมด
  const courtCount = await prisma.court.count()
  
  // ถ้าไม่มีคอร์ทในฐานข้อมูล ให้สร้างคอร์ทเริ่มต้น
  if (courtCount === 0) {
    console.log('Creating default courts...')
    await prisma.court.createMany({
      data: [
        { name: 'Court 1' },
        { name: 'Court 2' }
      ],
      skipDuplicates: true
    })
    console.log('Default courts created.')
  }
}

export async function getCourts() {
  try {
    // สร้างคอร์ทเริ่มต้นก่อนถ้าจำเป็น
    await ensureDefaultCourts()
    
    // ดึงข้อมูลคอร์ททั้งหมด
    const courts = await prisma.court.findMany({
      orderBy: { name: 'asc' }
    })
    
    return {
      success: true,
      courts
    }
  } catch (error: any) {
    console.error('Error fetching courts:', error)
    return {
      success: false,
      error: error.message
    }
  }
}