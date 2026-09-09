import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { isAdminRequest } from '@/lib/challenge/auth'
import { adminClient } from '@/lib/challenge/supabase'

export const maxDuration = 30

const MAX_BYTES = 12 * 1024 * 1024 // 12 MB before compression
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

/**
 * POST /api/challenge/upload — admin only.
 *
 * Phone photos are large, so each image is resized and re-encoded to WebP
 * before it reaches storage. Files are keyed by day + slot + timestamp so a
 * re-upload never overwrites another day's image, and the caller passes the
 * previous URL as `replacing` when it wants the old object removed.
 */
export async function POST(req: NextRequest) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sb = adminClient()
  if (!sb) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = form.get('file') as File | null
  const day = String(form.get('day') ?? '').trim()
  const slot = String(form.get('slot') ?? '').trim()
  const replacing = String(form.get('replacing') ?? '').trim()

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No file received' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image is larger than 12 MB' }, { status: 413 })
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported image type: ${file.type}` }, { status: 415 })
  }
  if (!/^\d+$/.test(day) || !/^(1|2|3|progress)$/.test(slot)) {
    return NextResponse.json({ error: 'Invalid day or slot' }, { status: 400 })
  }

  let optimized: Buffer
  try {
    const input = Buffer.from(await file.arrayBuffer())
    optimized = await sharp(input)
      .rotate()                                   // honour EXIF orientation from phones
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
  } catch (e) {
    console.error('[challenge] image processing failed:', e)
    return NextResponse.json({ error: 'Could not process that image.' }, { status: 422 })
  }

  const path = `day-${day.padStart(3, '0')}/slot-${slot}-${Date.now()}.webp`

  const { error } = await sb.storage
    .from('challenge')
    .upload(path, optimized, { contentType: 'image/webp', upsert: false })

  if (error) {
    console.error('[challenge] upload failed:', error.message)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }

  const { data: pub } = sb.storage.from('challenge').getPublicUrl(path)

  // Remove the image this one replaces, so storage does not accumulate orphans.
  if (replacing && replacing.includes('/challenge/')) {
    const oldPath = replacing.split('/challenge/').pop()
    if (oldPath) {
      const { error: rmErr } = await sb.storage.from('challenge').remove([oldPath])
      if (rmErr) console.warn('[challenge] could not remove replaced image:', rmErr.message)
    }
  }

  return NextResponse.json({ url: pub.publicUrl, path })
}
