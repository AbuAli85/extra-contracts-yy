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
    console.log("Triggering Make.com webhook with payload:", JSON.stringify(payloadForMake, null, 2))
    
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

    // Make.com typically returns JSON, not a PDF blob
    const responseText = await makeResponse.text()
    console.log("Make.com response:", responseText)
    
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse Make.com response as JSON:", parseError)
      return null
    }

    // Check if Make.com returned a PDF URL in the response
    const pdfUrl = responseData.pdf_url || responseData.url || responseData.download_url
    
    if (pdfUrl) {
      console.log("PDF URL received from Make.com:", pdfUrl)
      return pdfUrl
    }

    // If no PDF URL in response, check if Make.com uploaded to Supabase directly
    if (responseData.success || responseData.ok) {
      console.log("Make.com indicated success, checking for uploaded PDF...")
      
      // Try to find the PDF in Supabase storage
      const filePath = `contract_pdfs/${contractId}/`
      const { data: files, error: listError } = await supabaseAdmin.storage
        .from("contracts")
        .list(filePath)
      
      if (listError) {
        console.error("Error listing files in storage:", listError)
        return null
      }
      
      if (files && files.length > 0) {
        // Get the most recent PDF file
        const pdfFile = files.find(file => file.name.endsWith('.pdf'))
        if (pdfFile) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from("contracts")
            .getPublicUrl(`${filePath}${pdfFile.name}`)
          return publicUrlData?.publicUrl || null
        }
      }
    }

    console.error("No PDF URL found in Make.com response")
    return null
  } catch (error) {
    console.error("Error in PDF generation/upload process:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== CONTRACT API ROUTE START ===")
    const supabase = createServerComponentClient()
    let supabaseAdmin
    try {
      supabaseAdmin = getSupabaseAdmin()
    } catch (adminError) {
      console.error("✗ Supabase admin client error:", adminError)
      return NextResponse.json(
        { message: "Server configuration error", error: "Failed to initialize Supabase admin client", details: adminError instanceof Error ? adminError.message : String(adminError) },
        { status: 500 },
      )
    }
    const body = await request.json()
    console.log("Received contract data:", JSON.stringify(body, null, 2))

    // Flatten the nested payload
    const contractToInsert: Database["public"]["Tables"]["contracts"]["Insert"] = {
      contract_number: body.contract_number,
      contract_start_date: body.contract_start_date,
      contract_end_date: body.contract_end_date,
      first_party_id: body.first_party?.id,
      first_party_name_en: body.first_party?.name_en,
      first_party_name_ar: body.first_party?.name_ar,
      first_party_crn: body.first_party?.crn,
      second_party_id: body.second_party?.id,
      second_party_name_en: body.second_party?.name_en,
      second_party_name_ar: body.second_party?.name_ar,
      second_party_crn: body.second_party?.crn,
      promoter_id: body.promoter?.id,
      promoter_name_en: body.promoter?.name_en,
      promoter_name_ar: body.promoter?.name_ar,
      id_card_number: body.promoter?.id_card_number,
      promoter_id_card_url: body.promoter?.id_card_url,
      promoter_passport_url: body.promoter?.passport_url,
      email: body.email,
      // Add job_title, work_location, etc. if present
      job_title: body.job_title,
      work_location: body.work_location,
    }
    console.log("Contract to insert:", JSON.stringify(contractToInsert, null, 2))

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
    console.log("✓ Contract created:", newContract.id)

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
    console.log("✓ Party and promoter details fetched")

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
    console.log("✓ PDF generation completed:", pdfUrl ? "Success" : "Failed")

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

    console.log("=== CONTRACT API ROUTE SUCCESS ===")
    return NextResponse.json(
      { message: "Contract created successfully!", contract: finalContractData },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("=== CONTRACT API ROUTE ERROR ===")
    console.error("API Route Error:", error)
    return NextResponse.json(
      { message: "Internal server error", error: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 },
    )
  }
}
