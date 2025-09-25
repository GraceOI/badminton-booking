import { NextResponse } from 'next/server'

export async function GET() {
  const cid = process.env.GOOGLE_CLIENT_ID || ''
  const csec = process.env.GOOGLE_CLIENT_SECRET || ''
  const nextauthUrl = process.env.NEXTAUTH_URL || ''
  const nextauthSecret = process.env.NEXTAUTH_SECRET || ''

  return NextResponse.json({
    hasGoogleClientId: Boolean(cid),
    hasGoogleClientSecret: Boolean(csec),
    hasNextAuthUrl: Boolean(nextauthUrl),
    hasNextAuthSecret: Boolean(nextauthSecret),
  })
}


