"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase/server"
import { promoterProfileSchema } from "@/lib/promoter-profile-schema"
import type { Promoter } from "@/lib/types"
import { uploadImage } from "@/lib/supabase/storage"

interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

export async function createPromoter(
  prevState: ServerActionResponse | null,
  formData: FormData,
): Promise<ServerActionResponse<Promoter>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const rawData = Object.fromEntries(formData.entries())

  const parsed = promoterProfileSchema.safeParse(rawData)

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    console.error("Validation errors:", errors)
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors,
    }
  }

  let profile_picture_url: string | null = null
  const imageFile = formData.get("profile_picture_url") as File | null

  if (imageFile && imageFile.size > 0) {
    const uploadResult = await uploadImage(supabase, imageFile, "promoter_logos")
    if (uploadResult.success && uploadResult.data) {
      profile_picture_url = uploadResult.data.publicUrl
    } else {
      return {
        success: false,
        message: uploadResult.message || "Failed to upload profile picture.",
      }
    }
  }

  const { data, error } = await supabase
    .from("promoters")
    .insert([{ ...parsed.data, profile_picture_url }])
    .select()
    .single()

  if (error) {
    console.error("Error creating promoter:", error)
    return {
      success: false,
      message: `Failed to create promoter: ${error.message}`,
    }
  }

  revalidatePath("/manage-promoters")
  revalidatePath("/generate-contract")
  return {
    success: true,
    message: "Promoter created successfully!",
    data,
  }
}

export async function getPromoters(): Promise<ServerActionResponse<Promoter[]>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("promoters").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching promoters:", error)
    return {
      success: false,
      message: `Failed to fetch promoters: ${error.message}`,
    }
  }

  return {
    success: true,
    message: "Promoters fetched successfully.",
    data: data as Promoter[],
  }
}

export async function getPromoterById(id: string): Promise<ServerActionResponse<Promoter>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("promoters").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching promoter with ID ${id}:`, error)
    return {
      success: false,
      message: `Failed to fetch promoter: ${error.message}`,
    }
  }

  if (!data) {
    return {
      success: false,
      message: "Promoter not found.",
      data: null,
    }
  }

  return {
    success: true,
    message: "Promoter fetched successfully.",
    data: data as Promoter,
  }
}

export async function updatePromoter(
  id: string,
  prevState: ServerActionResponse | null,
  formData: FormData,
): Promise<ServerActionResponse<Promoter>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const rawData = Object.fromEntries(formData.entries())

  const parsed = promoterProfileSchema.safeParse(rawData)

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    console.error("Validation errors:", errors)
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors,
    }
  }

  let profile_picture_url: string | null = parsed.data.profile_picture_url || null
  const imageFile = formData.get("profile_picture_url") as File | null

  if (imageFile && imageFile.size > 0) {
    const uploadResult = await uploadImage(supabase, imageFile, "promoter_logos")
    if (uploadResult.success && uploadResult.data) {
      profile_picture_url = uploadResult.data.publicUrl
    } else {
      return {
        success: false,
        message: uploadResult.message || "Failed to upload profile picture.",
      }
    }
  } else if (formData.get("profile_picture_url_removed") === "true") {
    // Handle case where user explicitly removed the image
    profile_picture_url = null
  }

  const { data, error } = await supabase
    .from("promoters")
    .update({ ...parsed.data, profile_picture_url })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating promoter with ID ${id}:`, error)
    return {
      success: false,
      message: `Failed to update promoter: ${error.message}`,
    }
  }

  revalidatePath(`/manage-promoters/${id}/edit`)
  revalidatePath("/manage-promoters")
  revalidatePath("/generate-contract")
  return {
    success: true,
    message: "Promoter updated successfully!",
    data,
  }
}

export async function deletePromoter(id: string): Promise<ServerActionResponse> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("promoters").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting promoter with ID ${id}:`, error)
    return {
      success: false,
      message: `Failed to delete promoter: ${error.message}`,
    }
  }

  revalidatePath("/manage-promoters")
  revalidatePath("/generate-contract")
  return {
    success: true,
    message: "Promoter deleted successfully!",
  }
}
