import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { contract_number } = await request.json()

    if (!contract_number) {
      return NextResponse.json({ error: "Contract number is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if contract exists
    const { data: existingContract, error: fetchError } = await supabase
      .from("contracts")
      .select("*")
      .eq("contract_number", contract_number)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching contract:", fetchError)
      return NextResponse.json({ error: "Failed to fetch contract" }, { status: 500 })
    }

    // If contract doesn't exist, create it
    if (!existingContract) {
      const { error: insertError } = await supabase.from("contracts").insert({
        contract_number,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error creating contract:", insertError)
        return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
      }
    }

    // Update status to queued
    const { error: updateError } = await supabase
      .from("contracts")
      .update({
        status: "queued",
        updated_at: new Date().toISOString(),
      })
      .eq("contract_number", contract_number)

    if (updateError) {
      console.error("Error updating contract status:", updateError)
      return NextResponse.json({ error: "Failed to update contract status" }, { status: 500 })
    }

    // Trigger Make.com webhook if configured
    if (process.env.MAKE_FETCH_CONTRACT_WEBHOOK) {
      try {
        const makeResponse = await fetch(process.env.MAKE_FETCH_CONTRACT_WEBHOOK, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contract_number }),
        })

        if (!makeResponse.ok) {
          console.error("Make.com webhook failed:", await makeResponse.text())
          // Don't fail the entire request if webhook fails
        }
      } catch (webhookError) {
        console.error("Error calling Make.com webhook:", webhookError)
        // Don't fail the entire request if webhook fails
      }
    }

    return NextResponse.json({
      message: "Contract generation queued successfully",
      contract_number,
    })
  } catch (error) {
    console.error("Error in generate-contract API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle Make.com callbacks
export async function PUT(request: Request) {
  try {
    const { contract_number, status, pdf_url } = await request.json()

    if (!contract_number || !status) {
      return NextResponse.json({ error: "Contract number and status are required" }, { status: 400 })
    }

    const supabase = createClient()

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (pdf_url) {
      updateData.pdf_url = pdf_url
    }

    const { error } = await supabase.from("contracts").update(updateData).eq("contract_number", contract_number)

    if (error) {
      console.error("Error updating contract:", error)
      return NextResponse.json({ error: "Failed to update contract" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Contract updated successfully",
      contract_number,
      status,
    })
  } catch (error) {
    console.error("Error in contract update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
