"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Party } from "@/lib/types"
import type { ServerActionResponse } from "@/lib/dashboard-types"

export async function getParties(): Promise<ServerActionResponse<Party[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("parties").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching parties:", error)
    return { success: false, message: `Failed to fetch parties: ${error.message}` }
  }

  return { success: true, message: "Parties fetched successfully", data: data || [] }
}

export async function getPartyById(id: string): Promise<ServerActionResponse<Party>> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("parties").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching party:", error)
    return { success: false, message: `Failed to fetch party: ${error.message}` }
  }

  if (!data) {
    return { success: false, message: "Party not found" }
  }

  return { success: true, message: "Party fetched successfully", data }
}

export async function createParty(
  _prevState: unknown,
  partyData: FormData | Partial<Party>,
): Promise<ServerActionResponse<Party>> {
  const supabase = await createClient()

  const values =
    partyData instanceof FormData
      ? Object.fromEntries(partyData.entries())
      : partyData

  const { data, error } = await supabase.from("parties").insert(values).select().single()

  if (error) {
    console.error("Error creating party:", error)
    return { success: false, message: `Failed to create party: ${error.message}` }
  }

  revalidatePath("/manage-parties")
  return { success: true, message: "Party created successfully", data: data as Party }
}

export async function updateParty(
  id: string,
  _prevState: unknown,
  partyData: FormData | Partial<Party>,
): Promise<ServerActionResponse<Party>> {
  const supabase = await createClient()

  const values =
    partyData instanceof FormData
      ? Object.fromEntries(partyData.entries())
      : partyData

  const { data, error } = await supabase.from("parties").update(values).eq("id", id).select().single()

  if (error) {
    console.error("Error updating party:", error)
    return { success: false, message: `Failed to update party: ${error.message}` }
  }

  revalidatePath("/manage-parties")
  return { success: true, message: "Party updated successfully", data: data as Party }
}

export async function deleteParty(id: string): Promise<ServerActionResponse<null>> {
  const supabase = await createClient()

  const { error } = await supabase.from("parties").delete().eq("id", id)

  if (error) {
    console.error("Error deleting party:", error)
    return { success: false, message: `Failed to delete party: ${error.message}` }
  }

  revalidatePath("/manage-parties")
  return { success: true, message: "Party deleted successfully", data: null }
}
