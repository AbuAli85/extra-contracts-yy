import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const contractId = searchParams.get("id")

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (contractId) {
    // Fetch a single contract
    const { data, error } = await supabase
      .from("contracts")
      .select(
        `
        *,
        parties_a:party_a_id(name),
        parties_b:party_b_id(name),
        promoters(name)
      `,
      )
      .eq("id", contractId)
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
        *,
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

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from("contracts")
    .insert({
      ...body,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating contract:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const contractId = searchParams.get("id")

  if (!contractId) {
    return NextResponse.json({ error: "Contract ID is required" }, { status: 400 })
  }

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from("contracts")
    .update(body)
    .eq("id", contractId)
    .eq("user_id", user.id) // Ensure user can only update their own contracts
    .select()
    .single()

  if (error) {
    console.error("Error updating contract:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Contract not found or unauthorized" }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const contractId = searchParams.get("id")

  if (!contractId) {
    return NextResponse.json({ error: "Contract ID is required" }, { status: 400 })
  }

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase.from("contracts").delete().eq("id", contractId).eq("user_id", user.id) // Ensure user can only delete their own contracts

  if (error) {
    console.error("Error deleting contract:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Contract deleted successfully" }, { status: 200 })
}
