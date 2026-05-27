import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const name = ((formData.get('name') as string) ?? '').trim()
    const subject = ((formData.get('subject') as string) ?? '').trim()
    const message = ((formData.get('message') as string) ?? '').trim()
    const sendCopy = formData.get('sendCopy') === 'true'
    const copyEmail = ((formData.get('copyEmail') as string) ?? '').trim()
    const attachment = formData.get('attachment') as File | null

    if (!name || !subject || !message) {
      return NextResponse.json({ error: 'Name, subject, and message are required' }, { status: 400 })
    }

    // Build Resend attachment if a file was provided
    type ResendAttachment = { filename: string; content: string }
    let attachments: ResendAttachment[] = []
    if (attachment && attachment.size > 0) {
      const buffer = Buffer.from(await attachment.arrayBuffer())
      attachments = [{ filename: attachment.name, content: buffer.toString('base64') }]
    }

    // ── Always save locally first ─────────────────────────────────────────────
    try {
      const dataDir = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
      const file = path.join(dataDir, 'contacts.json')
      const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : []
      list.push({
        id: Date.now(), name, subject, message,
        sendCopy, copyEmail: sendCopy ? copyEmail : null,
        attachment: attachment?.name ?? null,
        receivedAt: new Date().toISOString(), read: false,
      })
      fs.writeFileSync(file, JSON.stringify(list, null, 2))
    } catch (e) {
      console.error('[Contact] local save failed:', e)
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || 'phaneendragavara436@gmail.com'
    const resendKey = process.env.RESEND_API_KEY?.trim()

    if (!resendKey || resendKey === 're_your_resend_key_here') {
      console.warn('[Contact] No valid RESEND_API_KEY — message saved locally only')
      return NextResponse.json({ success: true, saved: true })
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:28px;border-radius:10px">
        <div style="background:#4f46e5;padding:18px 24px;border-radius:8px;margin-bottom:20px">
          <h2 style="color:#fff;margin:0;font-size:18px">📬 New Portfolio Message</h2>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">via phaneendra-portfolio contact form</p>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
          <tr style="border-bottom:1px solid #e2e8f0">
            <td style="padding:12px 16px;color:#64748b;font-size:13px;width:80px;font-weight:600">Name</td>
            <td style="padding:12px 16px;color:#0f172a;font-size:13px">${name}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;color:#64748b;font-size:13px;font-weight:600">Subject</td>
            <td style="padding:12px 16px;color:#0f172a;font-size:13px">${subject}</td>
          </tr>
          ${attachments.length ? `<tr style="border-top:1px solid #e2e8f0">
            <td style="padding:12px 16px;color:#64748b;font-size:13px;font-weight:600">Attachment</td>
            <td style="padding:12px 16px;color:#0f172a;font-size:13px">📎 ${attachment!.name}</td>
          </tr>` : ''}
        </table>
        <div style="background:#fff;border-radius:8px;padding:16px;margin-top:16px;border-left:4px solid #4f46e5;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
          <p style="color:#64748b;font-size:11px;margin:0 0 8px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Message</p>
          <p style="color:#1e293b;line-height:1.7;margin:0;white-space:pre-wrap;font-size:14px">${message}</p>
        </div>
        ${sendCopy && copyEmail ? `<p style="color:#94a3b8;font-size:11px;margin-top:10px;text-align:center">A copy was sent to ${copyEmail}</p>` : ''}
        <p style="color:#94a3b8;font-size:11px;margin-top:8px;text-align:center">Received via portfolio contact form</p>
      </div>
    `

    const resendPayload: Record<string, unknown> = {
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [toEmail],
      subject: `[Portfolio] ${subject} — from ${name}`,
      html,
    }
    if (attachments.length) resendPayload.attachments = attachments

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resendPayload),
    })

    const resendData = await resendRes.json()

    if (!resendRes.ok) {
      console.error('[Resend] Failed:', resendRes.status, JSON.stringify(resendData))
      return NextResponse.json({ success: true, saved: true, emailNote: resendData?.message || 'Email delivery failed' })
    }

    console.log('[Resend] Sent OK:', resendData.id)

    // Optionally send copy to sender (no attachment in the copy)
    if (sendCopy && copyEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(copyEmail)) {
      const copyHtml = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:28px;border-radius:10px">
          <div style="background:#4f46e5;padding:18px 24px;border-radius:8px;margin-bottom:20px">
            <h2 style="color:#fff;margin:0;font-size:18px">Copy of your message</h2>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">Sent to Phaneendra Gavara's portfolio</p>
          </div>
          <div style="background:#fff;border-radius:8px;padding:16px;border-left:4px solid #4f46e5;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
            <p style="color:#64748b;font-size:13px;margin:0 0 6px;font-weight:600">Subject: ${subject}</p>
            <p style="color:#1e293b;line-height:1.7;margin:0;white-space:pre-wrap;font-size:14px">${message}</p>
          </div>
          <p style="color:#94a3b8;font-size:11px;margin-top:16px;text-align:center">Phaneendra will get back to you soon!</p>
        </div>
      `
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Phaneendra Gavara <onboarding@resend.dev>',
          to: [copyEmail],
          subject: `Copy of your message: ${subject}`,
          html: copyHtml,
        }),
      }).catch(e => console.error('[Resend copy] error:', e))
    }

    return NextResponse.json({ success: true, emailed: true })

  } catch (err) {
    console.error('[API] /api/contact error:', err)
    return NextResponse.json({ success: true, saved: true }, { status: 200 })
  }
}
