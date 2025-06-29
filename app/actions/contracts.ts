"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import type { contractFormSchema } from "@/lib/generate-contract-form-schema"
import { devLog } from "@/lib/dev-log"
import type { Contract } from "@/lib/types"

export async function createContract(values: z.infer<typeof contractFormSchema>) {
  const supabase = createClient()

  const {
    firstPartyNameEn,
    firstPartyNameAr,
    secondPartyNameEn,
    secondPartyNameAr,
    promoterNameEn,
    promoterNameAr,
    contractType,
    startDate,
    endDate,
    contentEn,
    contentAr,
  } = values

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("contracts")
    .insert({
      user_id: user.id,
      first_party_name_en: firstPartyNameEn,
      first_party_name_ar: firstPartyNameAr,
      second_party_name_en: secondPartyNameEn,
      second_party_name_ar: secondPartyNameAr,
      promoter_name_en: promoterNameEn,
      promoter_name_ar: promoterNameAr,
      contract_type: contractType,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      content_en: contentEn,
      content_ar: contentAr,
      status: "Draft", // Initial status
    })
    .select()
    .single()

  if (error) {
    devLog("Error creating contract:", error)
    throw new Error(`Failed to create contract: ${error.message}`)
  }

  revalidatePath("/contracts")
  revalidatePath("/dashboard/contracts")
  redirect(`/contracts/${data.id}`)
}

export async function updateContract(id: string, values: z.infer<typeof contractFormSchema>) {
  const supabase = createClient()

  const {
    firstPartyNameEn,
    firstPartyNameAr,
    secondPartyNameEn,
    secondPartyNameAr,
    promoterNameEn,
    promoterNameAr,
    contractType,
    startDate,
    endDate,
    contentEn,
    contentAr,
  } = values

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("contracts")
    .update({
      first_party_name_en: firstPartyNameEn,
      first_party_name_ar: firstPartyNameAr,
      second_party_name_en: secondPartyNameEn,
      second_party_name_ar: secondPartyNameAr,
      promoter_name_en: promoterNameEn,
      promoter_name_ar: promoterNameAr,
      contract_type: contractType,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      content_en: contentEn,
      content_ar: contentAr,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    devLog("Error updating contract:", error)
    throw new Error(`Failed to update contract: ${error.message}`)
  }

  revalidatePath("/contracts")
  revalidatePath(`/contracts/${id}`)
  revalidatePath("/dashboard/contracts")
  redirect(`/contracts/${id}`)
}

export async function deleteContract(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("contracts").delete().eq("id", id)

  if (error) {
    devLog("Error deleting contract:", error)
    throw new Error(`Failed to delete contract: ${error.message}`)
  }

  revalidatePath("/contracts")
  revalidatePath("/dashboard/contracts")
  redirect("/contracts")
}

export async function updateContractStatus(contractId: string, newStatus: Contract["status"]) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("contracts")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", contractId)
    .select()
    .single()

  if (error) {
    devLog("Error updating contract status:", error)
    throw new Error(`Failed to update contract status: ${error.message}`)
  }

  revalidatePath("/contracts")
  revalidatePath(`/contracts/${contractId}`)
  revalidatePath("/dashboard/contracts")
  return data
}
