import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { contract_number } = await request.json()

    if (!contract_number) {
      return NextResponse.json({ error: "Contract number is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1) Trigger Make.com webhook
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL || process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL

    if (makeWebhookUrl) {
      try {
        const makeResponse = await fetch(makeWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contract_number,
            user_id: user.id,
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/generate-contract/callback`,
          }),
        })

        if (!makeResponse.ok) {
          console.error("Make.com webhook failed:", await makeResponse.text())
          return NextResponse.json({ error: "Webhook failed" }, { status: 502 })
        }
      } catch (webhookError) {
        console.error("Make.com webhook error:", webhookError)
        return NextResponse.json({ error: "Webhook failed" }, { status: 502 })
      }
    }

    // 2) Update contract status to queued in Supabase
    const { error: updateError } = await supabase
      .from("contracts")
      .update({
        status: "queued",
        updated_at: new Date().toISOString(),
      })
      .eq("contract_number", contract_number)

    if (updateError) {
      console.error("Supabase update failed:", updateError)
      return NextResponse.json({ error: "Database update failed" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Contract generation queued successfully",
      contract_number,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Callback endpoint for Make.com to update contract status
export async function PUT(request: Request) {
  try {
    const { contract_number, status, pdf_url, error_message } = await request.json()

    if (!contract_number) {
      return NextResponse.json({ error: "Contract number is required" }, { status: 400 })
    }

    const supabase = createClient()

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (pdf_url) {
      updateData.pdf_url = pdf_url
    }

    if (error_message) {
      updateData.error_message = error_message
    }

    const { error } = await supabase.from("contracts").update(updateData).eq("contract_number", contract_number)

    if (error) {
      console.error("Failed to update contract:", error)
      return NextResponse.json({ error: "Failed to update contract" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.json({ error: "Callback failed" }, { status: 500 })
  }
}
