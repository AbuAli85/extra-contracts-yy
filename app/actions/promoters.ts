"use server"

import { revalidatePath } from "next/cache"
import type { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import type { promoterProfileSchema } from "@/lib/promoter-profile-schema"
import { devLog } from "@/lib/dev-log"
import type { Promoter } from "@/lib/types"

export async function createPromoter(values: z.infer<typeof promoterProfileSchema>) {
  const supabase = createClient()

  const {
    nameEn,
    nameAr,
    email,
    phone,
    address,
    city,
    country,
    zipCode,
    contactPerson,
    contactPersonEmail,
    contactPersonPhone,
    website,
    logoUrl,
  } = values

  const { data, error } = await supabase
    .from("promoters")
    .insert({
      name_en: nameEn,
      name_ar: nameAr,
      email,
      phone,
      address,
      city,
      country,
      zip_code: zipCode,
      contact_person: contactPerson,
      contact_person_email: contactPersonEmail,
      contact_person_phone: contactPersonPhone,
      website,
      logo_url: logoUrl,
    })
    .select()
    .single()

  if (error) {
    devLog("Error creating promoter:", error)
    throw new Error(`Failed to create promoter: ${error.message}`)
  }

  revalidatePath("/manage-promoters")
  return data
}

export async function updatePromoter(id: string, values: z.infer<typeof promoterProfileSchema>) {
  const supabase = createClient()

  const {
    nameEn,
    nameAr,
    email,
    phone,
    address,
    city,
    country,
    zipCode,
    contactPerson,
    contactPersonEmail,
    contactPersonPhone,
    website,
    logoUrl,
  } = values

  const { data, error } = await supabase
    .from("promoters")
    .update({
      name_en: nameEn,
      name_ar: nameAr,
      email,
      phone,
      address,
      city,
      country,
      zip_code: zipCode,
      contact_person: contactPerson,
      contact_person_email: contactPersonEmail,
      contact_person_phone: contactPersonPhone,
      website,
      logo_url: logoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    devLog("Error updating promoter:", error)
    throw new Error(`Failed to update promoter: ${error.message}`)
  }

  revalidatePath("/manage-promoters")
  revalidatePath(`/manage-promoters/${id}`)
  return data
}

export async function deletePromoter(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("promoters").delete().eq("id", id)

  if (error) {
    devLog("Error deleting promoter:", error)
    throw new Error(`Failed to delete promoter: ${error.message}`)
  }

  revalidatePath("/manage-promoters")
}

export async function updatePromoterStatus(promoterId: string, newStatus: Promoter["status"]) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("promoters")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", promoterId)
    .select()
    .single()

  if (error) {
    devLog("Error updating promoter status:", error)
    throw new Error(`Failed to update promoter status: ${error.message}`)
  }

  revalidatePath("/manage-promoters")
  revalidatePath(`/manage-promoters/${promoterId}`)
  return data
}
