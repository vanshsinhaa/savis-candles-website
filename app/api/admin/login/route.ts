import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken } from '@/lib/admin-auth'

// In-memory rate limiter (resets on restart — acceptable for single-owner site)
const attempts = new Map<string, { count: number; resetAt: number }>()

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const now = Date.now()

  // Check rate limit
  const rec = attempts.get(ip)
  if (rec && now < rec.resetAt && rec.count >= 5) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait 15 minutes.' },
      { status: 429 }
    )
  }

  // Reset window if expired
  if (!rec || now >= rec.resetAt) {
    attempts.set(ip, { count: 0, resetAt: now + 15 * 60 * 1000 })
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { password } = body
  const adminPassword = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!adminPassword || !secret) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  if (!password || password !== adminPassword) {
    const current = attempts.get(ip)!
    attempts.set(ip, { ...current, count: current.count + 1 })
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  // Success — reset and issue token
  attempts.delete(ip)
  const token = await createAdminToken(secret)

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60,
    path: '/',
  })

  return response
}
