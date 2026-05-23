import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const supabase = createAdminClient()

    const { error: dbError } = await supabase
      .from('email_subscribers')
      .insert({
        email: normalizedEmail,
        source: source || 'landing_page',
        is_active: true,
      })

    if (dbError && dbError.code !== '23505') {
      console.error('Supabase insert error:', dbError)
      return NextResponse.json(
        { error: 'Something went wrong. Try again.' },
        { status: 500 }
      )
    }

    if (process.env.RESEND_AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email: normalizedEmail,
          audienceId: process.env.RESEND_AUDIENCE_ID,
          unsubscribed: false,
        })
      } catch (resendError) {
        console.error('Resend contact create failed:', resendError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Try again.' },
      { status: 500 }
    )
  }
}