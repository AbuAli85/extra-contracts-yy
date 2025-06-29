import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (id) {
    // Fetch a single contract by ID
    const { data, error } = await supabase
      .from("contracts")
      .select(
        `
        *,
        parties_a:party_a_id(id, name, email, phone, address, type),
        parties_b:party_b_id(id, name, email, phone, address, type),
        promoters(id, name, email, phone, company, address, city, state, zip_code, country, bio, profile_picture_url)
      `,
      )
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching contract:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } else {
    // Fetch all contracts
    const { data, error } = await supabase
      .from("contracts")
      .select(
        `
        id,
        contract_id,
        contract_name,
        contract_type,
        status,
        effective_date,
        termination_date,
        created_at,
        updated_at,
        parties_a:party_a_id(name),
        parties_b:party_b_id(name),
        promoters(name)
      `,
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contracts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  }
}
