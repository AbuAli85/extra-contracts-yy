import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { party_a, party_b, contract_type, description, retry_id } = body

    // Validate required fields
    if (!party_a || !party_b || !contract_type) {
      return NextResponse.json({ error: "Missing required fields: party_a, party_b, contract_type" }, { status: 400 })
    }

    // Generate contract number
    const contractNumber = `CTR-${Date.now()}-${nanoid(6)}`

    // Create contract record
    const contractData = {
      contract_number: contractNumber,
      party_a,
      party_b,
      contract_type,
      description: description || null,
      status: "pending" as const,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: contract, error: insertError } = await supabase
      .from("contracts")
      .insert(contractData)
      .select()
      .single()

    if (insertError) {
      console.error("Database insert error:", insertError)
      return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
    }

    // Send to Make.com webhook for processing
    if (process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL) {
      try {
        const webhookPayload = {
          contract_id: contract.id,
          contract_number: contractNumber,
          party_a,
          party_b,
          contract_type,
          description,
          user_id: user.id,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/generate-contract`,
        }

        const webhookResponse = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        })

        if (!webhookResponse.ok) {
          console.error("Webhook failed:", await webhookResponse.text())
          // Update contract status to failed
          await supabase
            .from("contracts")
            .update({ status: "failed", updated_at: new Date().toISOString() })
            .eq("id", contract.id)
        } else {
          // Update contract status to queued
          await supabase
            .from("contracts")
            .update({ status: "queued", updated_at: new Date().toISOString() })
            .eq("id", contract.id)
        }
      } catch (webhookError) {
        console.error("Webhook error:", webhookError)
        // Update contract status to failed
        await supabase
          .from("contracts")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("id", contract.id)
      }
    }

    return NextResponse.json({
      success: true,
      contract,
      message: "Contract generation initiated successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { contract_id, status, pdf_url, error_message } = body

    // Validate required fields
    if (!contract_id || !status) {
      return NextResponse.json({ error: "Missing required fields: contract_id, status" }, { status: 400 })
    }

    // Update contract in database
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

    const { data: contract, error: updateError } = await supabase
      .from("contracts")
      .update(updateData)
      .eq("id", contract_id)
      .select()
      .single()

    if (updateError) {
      console.error("Database update error:", updateError)
      return NextResponse.json({ error: "Failed to update contract" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      contract,
      message: "Contract updated successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
