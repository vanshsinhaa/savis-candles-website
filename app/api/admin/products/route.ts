import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '@/lib/admin-auth'

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_session')?.value
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!token || !secret) return false
  return verifyAdminToken(token, secret)
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Admin products GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }

  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Admin products POST error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
