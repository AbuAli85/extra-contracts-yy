import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const generateContractSchema = z.object({
  contractData: z.object({
    parties: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["individual", "company"]),
        email: z.string().email().optional(),
        address: z.string().optional(),
      }),
    ),
    contractType: z.string(),
    terms: z.record(z.any()),
    language: z.enum(["en", "es", "both"]).default("both"),
  }),
})

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
    const { contractData } = generateContractSchema.parse(body)

    // Create contract record in database
    const { data: contract, error: dbError } = await supabase
      .from("contracts")
      .insert({
        user_id: user.id,
        status: "pending",
        contract_type: contractData.contractType,
        parties: contractData.parties,
        terms: contractData.terms,
        language: contractData.language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
    }

    // Trigger Make.com webhook for contract generation
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL || process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL

    if (makeWebhookUrl) {
      try {
        const webhookPayload = {
          contractId: contract.id,
          userId: user.id,
          contractData: {
            ...contractData,
            contractId: contract.id,
          },
          callbackUrl: `${request.nextUrl.origin}/api/contracts/${contract.id}/callback`,
        }

        const webhookResponse = await fetch(makeWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        })

        if (!webhookResponse.ok) {
          throw new Error(`Webhook failed: ${webhookResponse.status}`)
        }

        // Update status to processing
        await supabase
          .from("contracts")
          .update({
            status: "processing",
            updated_at: new Date().toISOString(),
          })
          .eq("id", contract.id)
      } catch (webhookError) {
        console.error("Webhook error:", webhookError)

        // Update status to failed
        await supabase
          .from("contracts")
          .update({
            status: "failed",
            error_message: "Failed to trigger contract generation",
            updated_at: new Date().toISOString(),
          })
          .eq("id", contract.id)
      }
    }

    return NextResponse.json({
      success: true,
      contractId: contract.id,
      status: contract.status,
    })
  } catch (error) {
    console.error("Contract generation error:", error)
    return NextResponse.json({ error: "Failed to generate contract" }, { status: 500 })
  }
}

// Callback endpoint for Make.com to update contract status
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { contractId, status, pdfUrl, errorMessage } = body

    if (!contractId) {
      return NextResponse.json({ error: "Contract ID required" }, { status: 400 })
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (pdfUrl) {
      updateData.pdf_url = pdfUrl
    }

    if (errorMessage) {
      updateData.error_message = errorMessage
    }

    const { error } = await supabase.from("contracts").update(updateData).eq("id", contractId)

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
