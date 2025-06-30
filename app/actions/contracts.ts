"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Contract, ContractInsert, ContractUpdate } from "@/lib/types"

export async function getContracts(): Promise<Contract[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contracts:", error)
    return []
  }

  return data || []
}

export async function getContractById(id: string): Promise<Contract | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("contracts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching contract:", error)
    return null
  }

  return data
}

export async function createContract(contractData: ContractInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("contracts").insert(contractData).select().single()

  if (error) {
    console.error("Error creating contract:", error)
    throw new Error("Failed to create contract")
  }

  revalidatePath("/contracts")
  return data
}

export async function updateContract(id: string, contractData: ContractUpdate) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("contracts").update(contractData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating contract:", error)
    throw new Error("Failed to update contract")
  }

  revalidatePath("/contracts")
  revalidatePath(`/contracts/${id}`)
  return data
}

export async function deleteContract(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("contracts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting contract:", error)
    throw new Error("Failed to delete contract")
  }

  revalidatePath("/contracts")
}
