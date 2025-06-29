"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase/server"
import { partySchema } from "@/lib/party-schema"
import type { Party } from "@/lib/types"

interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

export async function createParty(
  prevState: ServerActionResponse | null,
  formData: FormData,
): Promise<ServerActionResponse<Party>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const rawData = Object.fromEntries(formData.entries())

  const parsed = partySchema.safeParse(rawData)

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    console.error("Validation errors:", errors)
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors,
    }
  }

  const { data, error } = await supabase.from("parties").insert([parsed.data]).select().single()

  if (error) {
    console.error("Error creating party:", error)
    return {
      success: false,
      message: `Failed to create party: ${error.message}`,
    }
  }

  revalidatePath("/manage-parties")
  revalidatePath("/generate-contract")
  return {
    success: true,
    message: "Party created successfully!",
    data,
  }
}

export async function getParties(): Promise<ServerActionResponse<Party[]>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("parties").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching parties:", error)
    return {
      success: false,
      message: `Failed to fetch parties: ${error.message}`,
    }
  }

  return {
    success: true,
    message: "Parties fetched successfully.",
    data: data as Party[],
  }
}

export async function deleteParty(id: string): Promise<ServerActionResponse> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("parties").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting party with ID ${id}:`, error)
    return {
      success: false,
      message: `Failed to delete party: ${error.message}`,
    }
  }

  revalidatePath("/manage-parties")
  revalidatePath("/generate-contract")
  return {
    success: true,
    message: "Party deleted successfully!",
  }
}
