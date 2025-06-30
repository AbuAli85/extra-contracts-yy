"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Promoter } from "@/lib/types"
import type { ServerActionResponse } from "@/lib/dashboard-types"

export async function getPromoters(): Promise<ServerActionResponse<Promoter[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("promoters").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching promoters:", error)
    return { success: false, message: `Failed to fetch promoters: ${error.message}` }
  }

  return { success: true, message: "Promoters fetched successfully", data: data || [] }
}

export async function getPromoterById(id: string): Promise<ServerActionResponse<Promoter>> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("promoters").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching promoter:", error)
    return { success: false, message: `Failed to fetch promoter: ${error.message}` }
  }

  if (!data) {
    return { success: false, message: "Promoter not found" }
  }

  return { success: true, message: "Promoter fetched successfully", data }
}

export async function createPromoter(
  _prevState: unknown,
  promoterData: FormData | Partial<Promoter>,
): Promise<ServerActionResponse<Promoter>> {
  const supabase = await createClient()

  const values =
    promoterData instanceof FormData
      ? Object.fromEntries(promoterData.entries())
      : promoterData

  const { data, error } = await supabase.from("promoters").insert(values).select().single()

  if (error) {
    console.error("Error creating promoter:", error)
    return { success: false, message: `Failed to create promoter: ${error.message}` }
  }

  revalidatePath("/manage-promoters")
  return { success: true, message: "Promoter created successfully", data: data as Promoter }
}

export async function updatePromoter(
  id: string,
  _prevState: unknown,
  promoterData: FormData | Partial<Promoter>,
): Promise<ServerActionResponse<Promoter>> {
  const supabase = await createClient()

  const values =
    promoterData instanceof FormData
      ? Object.fromEntries(promoterData.entries())
      : promoterData

  const { data, error } = await supabase.from("promoters").update(values).eq("id", id).select().single()

  if (error) {
    console.error("Error updating promoter:", error)
    return { success: false, message: `Failed to update promoter: ${error.message}` }
  }

  revalidatePath("/manage-promoters")
  revalidatePath(`/manage-promoters/${id}`)
  return { success: true, message: "Promoter updated successfully", data: data as Promoter }
}

export async function deletePromoter(id: string): Promise<ServerActionResponse<null>> {
  const supabase = await createClient()

  const { error } = await supabase.from("promoters").delete().eq("id", id)

  if (error) {
    console.error("Error deleting promoter:", error)
    return { success: false, message: `Failed to delete promoter: ${error.message}` }
  }

  revalidatePath("/manage-promoters")
  return { success: true, message: "Promoter deleted successfully", data: null }
}
