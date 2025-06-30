// app/api/trigger-webhook/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { contract_id } = await req.json()
  const hookUrl = process.env.MAKE_WEBHOOK_URL! // _no_ NEXT_PUBLIC_ here

  try {
    await fetch(hookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract_id }),
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Webhook failed:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
