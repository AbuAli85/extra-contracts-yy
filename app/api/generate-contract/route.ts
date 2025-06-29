import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  try {
    const { contract_number } = await request.json()

    if (!contract_number) {
      return NextResponse.json({ error: "Contract number is required" }, { status: 400 })
    }

    // 1) Trigger Make.com webhook
    const makeRes = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract_number }),
    })

    if (!makeRes.ok) {
      console.error("Make.com failed:", await makeRes.text())
      return NextResponse.json({ error: "Webhook failed" }, { status: 502 })
    }

    // 2) Update contract status to queued
    const { error } = await supabase
      .from("contracts")
      .update({ status: "queued", updated_at: new Date().toISOString() })
      .eq("contract_number", contract_number)

    if (error) {
      console.error("Supabase update failed:", error)
      return NextResponse.json({ error: "Database update failed" }, { status: 500 })
    }

    return NextResponse.json({ message: "Contract generation queued successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
