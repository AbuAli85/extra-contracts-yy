import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { party_a, party_b, contract_type, description } = body

    // Validate required fields
    if (!party_a || !party_b || !contract_type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Generate contract number
    const contractNumber = `CNT-${nanoid(8).toUpperCase()}`

    // Create contract record
    const { data: contract, error: insertError } = await supabase
      .from("contracts")
      .insert({
        contract_number: contractNumber,
        party_a,
        party_b,
        contract_type,
        description,
        status: "pending",
        user_id: user.id,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating contract:", insertError)
      return NextResponse.json({ success: false, error: "Failed to create contract" }, { status: 500 })
    }

    // Send to Make.com webhook for processing
    if (process.env.MAKE_WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(process.env.MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contract_id: contract.id,
            contract_number: contractNumber,
            party_a,
            party_b,
            contract_type,
            description,
            user_id: user.id,
          }),
        })

        if (!webhookResponse.ok) {
          console.error("Webhook failed:", await webhookResponse.text())
          // Update contract status to failed
          await supabase
            .from("contracts")
            .update({ status: "failed", error_message: "Webhook failed" })
            .eq("id", contract.id)
        } else {
          // Update contract status to queued
          await supabase.from("contracts").update({ status: "queued" }).eq("id", contract.id)
        }
      } catch (webhookError) {
        console.error("Webhook error:", webhookError)
        // Update contract status to failed
        await supabase
          .from("contracts")
          .update({ status: "failed", error_message: "Webhook error" })
          .eq("id", contract.id)
      }
    }

    return NextResponse.json({
      success: true,
      contract: {
        id: contract.id,
        contract_number: contract.contract_number,
        party_a: contract.party_a,
        party_b: contract.party_b,
        contract_type: contract.contract_type,
        description: contract.description,
        status: contract.status,
        created_at: contract.created_at,
        updated_at: contract.updated_at,
        user_id: contract.user_id,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { contract_id, status, pdf_url, error_message } = body

    if (!contract_id || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Update contract status
    const { error: updateError } = await supabase
      .from("contracts")
      .update({
        status,
        pdf_url,
        error_message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contract_id)

    if (updateError) {
      console.error("Error updating contract:", updateError)
      return NextResponse.json({ success: false, error: "Failed to update contract" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
