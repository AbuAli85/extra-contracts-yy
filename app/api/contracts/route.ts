import { type NextRequest, NextResponse } from "next/server"
// Import the lazy-initialized admin client
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { createServerComponentClient } from "@/lib/supabaseServer"
import { contractGeneratorSchema } from "@/lib/schema-generator" // Your Zod schema for validation
import type { BilingualPdfData } from "@/lib/types"
import type { Database } from "@/types/supabase"
import { format } from "date-fns"

// Placeholder for your PDF generation logic (e.g., calling Google Docs API via Make.com)
async function generateBilingualPdf(
  contractData: BilingualPdfData,
  contractId: string,
): Promise<string | null> {
  const supabaseAdmin = getSupabaseAdmin() // Get client instance
  const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL
  if (!makeWebhookUrl) {
    console.error("Make.com webhook URL (MAKE_WEBHOOK_URL) is not configured.")
    return null
  }

  const payloadForMake = {
    contract_id: contractId,
    first_party_name: contractData.first_party_name_en,
    second_party_name: contractData.second_party_name_en,
    promoter_name: contractData.promoter_name_en,
    start_date: contractData.contract_start_date,
    end_date: contractData.contract_end_date,
    job_title: contractData.job_title,
    email: contractData.email,
  }

  try {
    const makeResponse = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadForMake),
    })

    if (!makeResponse.ok) {
      const errorBody = await makeResponse.text()
      console.error(`Make.com webhook failed: ${makeResponse.status} - ${errorBody}`)
      return null
    }

    const pdfBlob = await makeResponse.blob()
    if (pdfBlob.type !== "application/pdf") {
      console.error("Make.com did not return a PDF. Mimetype:", pdfBlob.type)
      return null
    }

    const filePath = `contract_pdfs/${contractId}/${Date.now()}.pdf`
    const { error: uploadError } = await supabaseAdmin.storage
      .from("contracts")
      .upload(filePath, pdfBlob, {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError)
      return null
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from("contracts").getPublicUrl(filePath)
    return publicUrlData?.publicUrl || null
  } catch (error) {
    console.error("Error in PDF generation/upload process:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    const supabaseAdmin = getSupabaseAdmin() // Service role client
    
    const body = await request.json()
    console.log("Received contract data:", JSON.stringify(body, null, 2))
    
    // Convert date strings to Date objects if needed
    const processedBody = {
      ...body,
      contract_start_date: body.contract_start_date ? new Date(body.contract_start_date) : null,
      contract_end_date: body.contract_end_date ? new Date(body.contract_end_date) : null,
    }
    
    const validation = contractGeneratorSchema.safeParse(processedBody)

    if (!validation.success) {
      console.error("Validation failed:", validation.error.format())
      return NextResponse.json(
        { 
          message: "Invalid input", 
          errors: validation.error.format(),
          receivedData: body 
        },
        { status: 400 },
      )
    }

    const { data: validatedData } = validation
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const contractToInsert: Database["public"]["Tables"]["contracts"]["Insert"] = {
      first_party_id: validatedData.first_party_id,
      second_party_id: validatedData.second_party_id,
      promoter_id: validatedData.promoter_id,
      contract_start_date: validatedData.contract_start_date ? format(validatedData.contract_start_date, "yyyy-MM-dd") : null,
      contract_end_date: validatedData.contract_end_date ? format(validatedData.contract_end_date, "yyyy-MM-dd") : null,
      email: validatedData.email,
      job_title: validatedData.job_title,
      work_location: validatedData.work_location,
      user_id: user?.id,
    }

    const { data: newContract, error: insertError } = await supabase
      .from("contracts")
      .insert(contractToInsert)
      .select()
      .single()

    if (insertError) {
      console.error("Supabase insert error:", insertError)
      return NextResponse.json(
        { message: "Failed to create contract", error: insertError.message },
        { status: 500 },
      )
    }
    if (!newContract) {
      return NextResponse.json(
        { message: "Failed to create contract, no data returned after insert." },
        { status: 500 },
      )
    }

    const [party1, party2, promoterDetails] = await Promise.all([
      supabase
        .from("parties")
        .select("name_en, name_ar")
        .eq("id", newContract.first_party_id)
        .single(),
      supabase
        .from("parties")
        .select("name_en, name_ar")
        .eq("id", newContract.second_party_id)
        .single(),
      supabase
        .from("promoters")
        .select("name_en, name_ar")
        .eq("id", newContract.promoter_id)
        .single(),
    ])

    const pdfData: BilingualPdfData = {
      first_party_name_en: party1.data?.name_en,
      first_party_name_ar: party1.data?.name_ar,
      second_party_name_en: party2.data?.name_en,
      second_party_name_ar: party2.data?.name_ar,
      promoter_name_en: promoterDetails.data?.name_en,
      promoter_name_ar: promoterDetails.data?.name_ar,
      contract_start_date: newContract.contract_start_date ?? null,
      contract_end_date: newContract.contract_end_date ?? null,
      job_title: newContract.job_title,
      email: newContract.email,
    }

    const pdfUrl = await generateBilingualPdf(pdfData, newContract.id)

    let finalContractData = newContract
    if (pdfUrl) {
      const { data: updatedContractWithPdf, error: updateError } = await supabase
        .from("contracts")
        .update({ pdf_url: pdfUrl }) // Ensure this is pdf_url
        .eq("id", newContract.id)
        .select()
        .single()

      if (updateError) {
        console.error("Supabase update error (pdf_url):", updateError)
      } else if (updatedContractWithPdf) {
        finalContractData = updatedContractWithPdf
      }
    }

    return NextResponse.json(
      { message: "Contract created successfully!", contract: finalContractData },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("API Route Error:", error)
    
    // Check if it's a Supabase admin client error
    if (error.message?.includes("Supabase credentials are missing")) {
      return NextResponse.json(
        { 
          message: "Server configuration error", 
          error: "Supabase service role key is not configured. Please check your environment variables.",
          details: error.message 
        },
        { status: 500 },
      )
    }
    
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 },
    )
  }
}
