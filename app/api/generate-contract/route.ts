import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { party_a, party_b, contract_type, description, retry_id } = body

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
    const contractNumber = `CT-${Date.now()}-${nanoid(6)}`

    // Create contract record
    const contractData = {
      id: nanoid(),
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
      console.error("Error inserting contract:", insertError)
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
            .update({
              status: "failed",
              error_message: "Webhook processing failed",
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
        console.error("Webhook error:", webhookError)
        // Update contract status to failed
        await supabase
          .from("contracts")
          .update({
            status: "failed",
            error_message: "Webhook connection failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", contract.id)
      }
    }

    return NextResponse.json({
      success: true,
      contract,
      message: "Contract generation initiated successfully",
    })
  } catch (error) {
    console.error("API Error:", error)
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

    const { data, error } = await supabase.from("contracts").update(updateData).eq("id", contract_id).select().single()

    if (error) {
      console.error("Error updating contract:", error)
      return NextResponse.json({ success: false, error: "Failed to update contract" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      contract: data,
      message: "Contract updated successfully",
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
