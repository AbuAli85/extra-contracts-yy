import { type NextRequest, NextResponse } from "next/server"
// Import the lazy-initialized admin client
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { contractGeneratorSchema } from "@/types/custom" // Your Zod schema for validation
// Removed direct import of Database type from here, as it's handled in admin.ts

// Placeholder for your PDF generation logic (e.g., calling Google Docs API via Make.com)
async function generateBilingualPdf(contractData: any, contractId: string): Promise<string | null> {
  const supabaseAdmin = getSupabaseAdmin() // Get client instance
  const makeWebhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
  if (!makeWebhookUrl) {
    console.error("Make.com webhook URL (NEXT_PUBLIC_MAKE_WEBHOOK_URL) is not configured.")
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
    const { error: uploadError } = await supabaseAdmin.storage.from("contracts").upload(filePath, pdfBlob, {
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
  const supabaseAdmin = getSupabaseAdmin() // Get client instance within the handler
  try {
    const body = await request.json()
    const validation = contractGeneratorSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ message: "Invalid input", errors: validation.error.format() }, { status: 400 })
    }

    const { data: validatedData } = validation
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser()

    const contractToInsert = {
      // Explicitly type this if Database["public"]["Tables"]["contracts"]["Insert"] is needed
      first_party_id: validatedData.first_party_id,
      second_party_id: validatedData.second_party_id,
      promoter_id: validatedData.promoter_id,
      contract_start_date: validatedData.contract_start_date,
      contract_end_date: validatedData.contract_end_date,
      email: validatedData.email,
      job_title: validatedData.job_title,
      work_location: validatedData.work_location,
      user_id: user?.id,
    }

    const { data: newContract, error: insertError } = await supabaseAdmin
      .from("contracts")
      .insert(contractToInsert)
      .select()
      .single()

    if (insertError) {
      console.error("Supabase insert error:", insertError)
      return NextResponse.json({ message: "Failed to create contract", error: insertError.message }, { status: 500 })
    }
    if (!newContract) {
      return NextResponse.json(
        { message: "Failed to create contract, no data returned after insert." },
        { status: 500 },
      )
    }

    const [party1, party2, promoterDetails] = await Promise.all([
      supabaseAdmin.from("parties").select("name_en, name_ar").eq("id", newContract.first_party_id).single(),
      supabaseAdmin.from("parties").select("name_en, name_ar").eq("id", newContract.second_party_id).single(),
      supabaseAdmin.from("promoters").select("name_en, name_ar").eq("id", newContract.promoter_id).single(),
    ])

    const fullContractDataForPdf = {
      ...newContract,
      first_party_name_en: party1.data?.name_en,
      first_party_name_ar: party1.data?.name_ar,
      second_party_name_en: party2.data?.name_en,
      second_party_name_ar: party2.data?.name_ar,
      promoter_name_en: promoterDetails.data?.name_en,
      promoter_name_ar: promoterDetails.data?.name_ar,
    }

    const pdfUrl = await generateBilingualPdf(fullContractDataForPdf, newContract.id)

    let finalContractData = newContract
    if (pdfUrl) {
      const { data: updatedContractWithPdf, error: updateError } = await supabaseAdmin
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
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
