"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Contract } from "@/lib/types"
import type { ServerActionResponse } from "@/lib/dashboard-types"

export async function getContracts(): Promise<ServerActionResponse<Contract[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contracts:", error)
    return { success: false, message: `Failed to fetch contracts: ${error.message}` }
  }

  return { success: true, message: "Contracts fetched successfully", data: data || [] }
}

export async function getContractById(id: string): Promise<ServerActionResponse<Contract>> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("contracts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching contract:", error)
    return { success: false, message: `Failed to fetch contract: ${error.message}` }
  }

  if (!data) {
    return { success: false, message: "Contract not found" }
  }

  return { success: true, message: "Contract fetched successfully", data }
}

export async function createContract(
  _prevState: unknown,
  contractData: FormData | Partial<Contract>,
): Promise<ServerActionResponse<Contract>> {
  const supabase = await createClient()

  const values =
    contractData instanceof FormData
      ? Object.fromEntries(contractData.entries())
      : contractData

  const { data, error } = await supabase
    .from("contracts")
    .insert(values)
    .select()
    .single()

  if (error) {
    console.error("Error creating contract:", error)
    return { success: false, message: `Failed to create contract: ${error.message}` }
  }

  revalidatePath("/contracts")
  return { success: true, message: "Contract created successfully", data: data as Contract }
}

export async function updateContract(
  id: string,
  _prevState: unknown,
  contractData: FormData | Partial<Contract>,
): Promise<ServerActionResponse<Contract>> {
  const supabase = await createClient()

  const values =
    contractData instanceof FormData
      ? Object.fromEntries(contractData.entries())
      : contractData

  const { data, error } = await supabase
    .from("contracts")
    .update(values)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating contract:", error)
    return { success: false, message: `Failed to update contract: ${error.message}` }
  }

  revalidatePath("/contracts")
  revalidatePath(`/contracts/${id}`)
  return { success: true, message: "Contract updated successfully", data: data as Contract }
}

export async function deleteContract(id: string): Promise<ServerActionResponse<null>> {
  const supabase = await createClient()

  const { error } = await supabase.from("contracts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting contract:", error)
    return { success: false, message: `Failed to delete contract: ${error.message}` }
  }

  revalidatePath("/contracts")
  return { success: true, message: "Contract deleted successfully", data: null }
}
