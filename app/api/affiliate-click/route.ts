import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    await supabase.rpc('increment_click_count', { product_id: productId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Affiliate click tracking error:', error)
    return NextResponse.json({ success: true })
  }
}