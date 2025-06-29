import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const generateContractSchema = z.object({
  contract_number: z.string().min(1),
  party1_id: z.string().uuid().optional(),
  party2_id: z.string().uuid().optional(),
  contract_type: z.string().optional(),
})

const updateContractSchema = z.object({
  contract_number: z.string().min(1),
  status: z.enum(["pending", "queued", "processing", "completed", "failed"]),
  pdf_url: z.string().url().optional(),
  error_message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contract_number, party1_id, party2_id, contract_type } = generateContractSchema.parse(body)

    // Create or update contract in Supabase
    const { data: contract, error: contractError } = await supabase
      .from("contracts")
      .upsert({
        contract_number,
        party1_id,
        party2_id,
        contract_type,
        status: "queued",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (contractError) {
      console.error("Supabase contract error:", contractError)
      return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
    }

    // Trigger Make.com webhook
    if (process.env.MAKE_WEBHOOK_URL) {
      try {
        const makeResponse = await fetch(process.env.MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contract_number,
            party1_id,
            party2_id,
            contract_type,
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/generate-contract`,
          }),
        })

        if (!makeResponse.ok) {
          console.error("Make.com webhook failed:", await makeResponse.text())

          // Update contract status to failed
          await supabase
            .from("contracts")
            .update({
              status: "failed",
              error_message: "Failed to trigger Make.com webhook",
              updated_at: new Date().toISOString(),
            })
            .eq("contract_number", contract_number)
        } else {
          // Update status to processing
          await supabase
            .from("contracts")
            .update({
              status: "processing",
              updated_at: new Date().toISOString(),
            })
            .eq("contract_number", contract_number)
        }
      } catch (makeError) {
        console.error("Make.com webhook error:", makeError)

        await supabase
          .from("contracts")
          .update({
            status: "failed",
            error_message: "Network error calling Make.com webhook",
            updated_at: new Date().toISOString(),
          })
          .eq("contract_number", contract_number)
      }
    }

    return NextResponse.json({
      success: true,
      contract,
      message: "Contract generation started",
    })
  } catch (error) {
    console.error("Generate contract error:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { contract_number, status, pdf_url, error_message } = updateContractSchema.parse(body)

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
      .eq("contract_number", contract_number)
      .select()
      .single()

    if (updateError) {
      console.error("Supabase update error:", updateError)
      return NextResponse.json({ error: "Failed to update contract" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      contract,
      message: "Contract updated successfully",
    })
  } catch (error) {
    console.error("Update contract error:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
