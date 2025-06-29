"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase/server"
import { contractSchema } from "@/lib/validations/contract"
import type { Contract } from "@/lib/types"

interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

export async function createContract(
  prevState: ServerActionResponse | null,
  formData: FormData,
): Promise<ServerActionResponse<Contract>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const rawData = Object.fromEntries(formData.entries())

  // Convert checkbox to boolean
  const is_template = rawData.is_template === "on" ? true : false
  const is_archived = rawData.is_archived === "on" ? true : false

  const parsed = contractSchema.safeParse({
    ...rawData,
    contract_value: rawData.contract_value ? Number.parseFloat(rawData.contract_value as string) : undefined,
    effective_date: rawData.effective_date || undefined,
    termination_date: rawData.termination_date || undefined,
    is_template,
    is_archived,
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    console.error("Validation errors:", errors)
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors,
    }
  }

  const { data, error } = await supabase.from("contracts").insert([parsed.data]).select().single()

  if (error) {
    console.error("Error creating contract:", error)
    return {
      success: false,
      message: `Failed to create contract: ${error.message}`,
    }
  }

  revalidatePath("/contracts")
  revalidatePath("/dashboard/contracts")
  revalidatePath("/generate-contract")
  return {
    success: true,
    message: "Contract created successfully!",
    data,
  }
}

export async function getContracts(): Promise<ServerActionResponse<Contract[]>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
    return {
      success: false,
      message: `Failed to fetch contracts: ${error.message}`,
    }
  }

  // Flatten the nested party and promoter objects for easier consumption
  const flattenedData = data.map((contract) => ({
    ...contract,
    parties_a: contract.parties_a || null,
    parties_b: contract.parties_b || null,
    promoters: contract.promoters || null,
  })) as Contract[]

  return {
    success: true,
    message: "Contracts fetched successfully.",
    data: flattenedData,
  }
}

export async function getContractById(id: string): Promise<ServerActionResponse<Contract>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
    console.error(`Error fetching contract with ID ${id}:`, error)
    return {
      success: false,
      message: `Failed to fetch contract: ${error.message}`,
    }
  }

  if (!data) {
    return {
      success: false,
      message: "Contract not found.",
      data: null,
    }
  }

  // Flatten the nested party and promoter objects
  const flattenedData: Contract = {
    ...data,
    parties_a: data.parties_a || null,
    parties_b: data.parties_b || null,
    promoters: data.promoters || null,
  } as Contract

  return {
    success: true,
    message: "Contract fetched successfully.",
    data: flattenedData,
  }
}

export async function updateContract(
  id: string,
  prevState: ServerActionResponse | null,
  formData: FormData,
): Promise<ServerActionResponse<Contract>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const rawData = Object.fromEntries(formData.entries())

  // Convert checkbox to boolean
  const is_template = rawData.is_template === "on" ? true : false
  const is_archived = rawData.is_archived === "on" ? true : false

  const parsed = contractSchema.safeParse({
    ...rawData,
    contract_value: rawData.contract_value ? Number.parseFloat(rawData.contract_value as string) : undefined,
    effective_date: rawData.effective_date || undefined,
    termination_date: rawData.termination_date || undefined,
    is_template,
    is_archived,
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    console.error("Validation errors:", errors)
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors,
    }
  }

  const { data, error } = await supabase.from("contracts").update(parsed.data).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating contract with ID ${id}:`, error)
    return {
      success: false,
      message: `Failed to update contract: ${error.message}`,
    }
  }

  revalidatePath(`/contracts/${id}`)
  revalidatePath("/contracts")
  revalidatePath("/dashboard/contracts")
  return {
    success: true,
    message: "Contract updated successfully!",
    data,
  }
}

export async function deleteContract(id: string): Promise<ServerActionResponse> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("contracts").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting contract with ID ${id}:`, error)
    return {
      success: false,
      message: `Failed to delete contract: ${error.message}`,
    }
  }

  revalidatePath("/contracts")
  revalidatePath("/dashboard/contracts")
  return {
    success: true,
    message: "Contract deleted successfully!",
  }
}
