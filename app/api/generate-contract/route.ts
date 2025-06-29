import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { contract_number } = await request.json()

    if (!contract_number) {
      return NextResponse.json({ error: "Contract number is required" }, { status: 400 })
    }

    // 1) Trigger Make.com FetchContract webhook
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL
    if (!makeWebhookUrl) {
      return NextResponse.json({ error: "Make.com webhook URL not configured" }, { status: 500 })
    }

    const makeRes = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract_number }),
    })

    if (!makeRes.ok) {
      console.error("Make.com failed:", await makeRes.text())
      return NextResponse.json({ error: "Fetch failed on Make.com" }, { status: 502 })
    }

    // 2) Mark status=queued in Supabase
    const supabase = createClient()
    const { error } = await supabase
      .from("contracts")
      .update({ status: "queued", updated_at: new Date().toISOString() })
      .eq("contract_number", contract_number)

    if (error) {
      console.error("Supabase update failed:", error)
      return NextResponse.json({ error: "Failed to update contract status" }, { status: 500 })
    }

    return NextResponse.json({ message: "Contract generation queued successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
