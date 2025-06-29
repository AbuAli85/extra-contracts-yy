import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createClient()

    // Create a new contract record
    const { data: contract, error: insertError } = await supabase
      .from("contracts")
      .insert({
        title: body.title || "Untitled Contract",
        status: "pending",
        contract_data: body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting contract:", insertError)
      return NextResponse.json({ error: "Failed to create contract record" }, { status: 500 })
    }

    // Trigger Make.com webhook for contract generation
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL || process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL

    if (makeWebhookUrl) {
      try {
        const webhookResponse = await fetch(makeWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contract_id: contract.id,
            ...body,
          }),
        })

        if (!webhookResponse.ok) {
          console.error("Make.com webhook failed:", await webhookResponse.text())

          // Update contract status to failed
          await supabase
            .from("contracts")
            .update({
              status: "failed",
              error_message: "Webhook trigger failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", contract.id)
        } else {
          // Update contract status to queued
          await supabase
            .from("contracts")
            .update({
              status: "queued",
              updated_at: new Date().toISOString(),
            })
            .eq("id", contract.id)
        }
      } catch (webhookError) {
        console.error("Error calling Make.com webhook:", webhookError)

        // Update contract status to failed
        await supabase
          .from("contracts")
          .update({
            status: "failed",
            error_message: "Webhook call failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", contract.id)
      }
    }

    return NextResponse.json({
      success: true,
      contract_id: contract.id,
      message: "Contract generation initiated",
    })
  } catch (error) {
    console.error("Error in generate-contract API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle Make.com callback
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { contract_id, status, pdf_url, error_message } = body

    if (!contract_id) {
      return NextResponse.json({ error: "contract_id is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Update contract with new status and data
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

    const { error } = await supabase.from("contracts").update(updateData).eq("id", contract_id)

    if (error) {
      console.error("Error updating contract:", error)
      return NextResponse.json({ error: "Failed to update contract" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Contract updated successfully",
    })
  } catch (error) {
    console.error("Error in contract callback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
