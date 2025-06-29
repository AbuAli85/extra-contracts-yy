import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { contract_number } = await request.json()

    if (!contract_number) {
      return NextResponse.json({ error: "Contract number is required" }, { status: 400 })
    }

    // 1) Trigger Make.com webhook
    const makeResponse = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contract_number }),
    })

    if (!makeResponse.ok) {
      console.error("Make.com webhook failed:", await makeResponse.text())
      return NextResponse.json({ error: "Failed to trigger contract generation" }, { status: 502 })
    }

    // 2) Update contract status to 'queued' in Supabase
    const { error: updateError } = await supabase
      .from("contracts")
      .update({
        status: "queued",
        updated_at: new Date().toISOString(),
      })
      .eq("contract_number", contract_number)

    if (updateError) {
      console.error("Supabase update failed:", updateError)
      return NextResponse.json({ error: "Failed to update contract status" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Contract generation queued successfully",
      contract_number,
    })
  } catch (error) {
    console.error("Contract generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
