import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  // Silently skip if not configured — notification is non-critical
  if (!process.env.RESEND_API_KEY || !process.env.STORE_OWNER_EMAIL) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const body = await request.json()
    const { name, email, phone, message } = body as {
      name: string
      email?: string | null
      phone?: string | null
      message?: string | null
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saviscandles.com"

    const emailRows = [
      email && `<tr><td style="padding:8px 0;color:#666;font-size:13px;width:80px;vertical-align:top">Email</td><td style="padding:8px 0;font-size:14px;color:#111">${email}</td></tr>`,
      phone && `<tr><td style="padding:8px 0;color:#666;font-size:13px;vertical-align:top">Phone</td><td style="padding:8px 0;font-size:14px;color:#111">${phone}</td></tr>`,
    ].filter(Boolean).join("")

    const conversationBlock = message
      ? `<div style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px;">
           <p style="font-size:12px;color:#999;margin:0 0 8px">Conversation</p>
           <p style="font-size:14px;color:#333;margin:0;line-height:1.6">${message.replace(/\|/g, "·")}</p>
         </div>`
      : ""

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:40px 20px;background:#f9f9f9;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e5e5;">
    <h1 style="font-family:Georgia,serif;font-size:22px;font-weight:300;color:#111;margin:0 0 4px">
      New lead from Ember 🕯️
    </h1>
    <p style="font-size:13px;color:#999;margin:0 0 24px">Someone reached out through the chat widget.</p>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;color:#666;font-size:13px;width:80px;vertical-align:top">Name</td>
        <td style="padding:8px 0;font-size:14px;color:#111;font-weight:500">${name}</td>
      </tr>
      ${emailRows}
    </table>

    ${conversationBlock}

    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #ebebeb;">
      <p style="font-size:12px;color:#999;margin:0">
        Mark as contacted in your admin dashboard:
        <a href="${siteUrl}/admin/leads" style="color:#111;text-decoration:underline">${siteUrl}/admin/leads</a>
      </p>
    </div>
  </div>
</body>
</html>`

    const { error } = await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? "Ember <onboarding@resend.dev>",
      to:      process.env.STORE_OWNER_EMAIL!,
      subject: `New lead from Ember — ${name}`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("notify-lead error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
