import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createClient()

    // Generate unique contract number
    const contractNumber = `CONTRACT-${nanoid(8).toUpperCase()}`

    // Insert contract into database
    const { data: contract, error } = await supabase
      .from("contracts")
      .insert({
        contract_number: contractNumber,
        status: "pending",
        contract_data: body,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
    }

    // Send to Make.com webhook
    if (process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contractId: contract.id,
            contractNumber,
            ...body,
          }),
        })

        if (!webhookResponse.ok) {
          console.error("Webhook failed:", webhookResponse.statusText)

          // Update contract status to failed
          await supabase.from("contracts").update({ status: "failed" }).eq("id", contract.id)
        } else {
          // Update contract status to processing
          await supabase.from("contracts").update({ status: "processing" }).eq("id", contract.id)
        }
      } catch (webhookError) {
        console.error("Webhook error:", webhookError)

        // Update contract status to failed
        await supabase.from("contracts").update({ status: "failed" }).eq("id", contract.id)
      }
    }

    return NextResponse.json({
      success: true,
      contract: {
        id: contract.id,
        contractNumber,
        status: "processing",
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { contractId, status, pdfUrl } = body

    const supabase = createClient()

    const { error } = await supabase
      .from("contracts")
      .update({
        status,
        pdf_url: pdfUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contractId)

    if (error) {
      console.error("Database update error:", error)
      return NextResponse.json({ error: "Failed to update contract" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
