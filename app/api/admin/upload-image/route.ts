import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '@/lib/admin-auth'

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_session')?.value
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!token || !secret) return false
  return verifyAdminToken(token, secret)
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const sku = (formData.get('sku') as string) || 'product'
    const oldPath = formData.get('oldPath') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only jpg, png, and webp files are allowed' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max size is 5MB.' }, { status: 400 })
    }

    const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
    const filename = `${sku}-${Date.now()}.${ext}`
    const arrayBuffer = await file.arrayBuffer()

    // Delete old image if it exists
    if (oldPath) {
      await supabaseAdmin.storage.from('product-images').remove([oldPath])
    }

    // Ensure bucket exists with public access
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'product-images')
    if (!bucketExists) {
      await supabaseAdmin.storage.createBucket('product-images', { public: true })
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(filename)

    return NextResponse.json({ url: publicUrlData.publicUrl, path: filename })
  } catch (err) {
    console.error('Upload route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
