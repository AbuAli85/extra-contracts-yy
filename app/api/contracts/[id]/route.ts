import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseAdmin }         from "@/lib/supabase/admin"
import { contractGeneratorSchema }  from "@/lib/schema-generator"
import { format }                   from "date-fns"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabaseAdmin = getSupabaseAdmin()
  const { id } = params

  // 1) parse & validate
  const body = await request.json()
  const parsed = contractGeneratorSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input", errors: parsed.error.format() }, { status: 400 })
  }

  // 2) build update payload (same date format!)
  const dataToUpdate = {
    ...parsed.data,
    contract_start_date: format(parsed.data.contract_start_date, "yyyy-MM-dd"),
    contract_end_date:   format(parsed.data.contract_end_date,   "yyyy-MM-dd"),
  }

  // 3) perform the update as service-role (bypass RLS)
  const { data: updated, error } = await supabaseAdmin
    .from("contracts")
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("API PUT /contracts/[id] error:", error)
    return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Contract updated!", contract: updated }, { status: 200 })
}
