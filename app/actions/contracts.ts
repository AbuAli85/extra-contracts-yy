"use server"

import { createServerComponentClient } from "@/lib/supabaseServer"
import type { Database } from "@/types/supabase"

export type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"]

export async function createContract(newContract: ContractInsert) {
  const supabase = await createServerComponentClient()
  const { data, error } = await supabase
    .from("contracts")
    .insert(newContract)
    .select(
      `id,
       created_at,
       job_title,
       contract_valid_from,
       contract_valid_until,
       status,
       pdf_url,
       first_party_id,
       second_party_id,
       promoter_id,
       parties!contracts_employer_id_fkey (id, name_en, name_ar),
       parties!contracts_client_id_fkey (id, name_en, name_ar),
       promoters (id, name_en, name_ar)`,
    )
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("Contract creation failed, no data returned.")
  return data
}

export async function deleteContract(contractId: string) {
  const supabase = await createServerComponentClient()
  const { error } = await supabase.from("contracts").delete().eq("id", contractId)
  if (error) throw new Error(error.message)
}

export async function updateContract(contractId: string, updatedContract: Partial<ContractInsert>) {
  const supabase = await createServerComponentClient()
  const { data, error } = await supabase
    .from("contracts")
    .update(updatedContract)
    .eq("id", contractId)
    .select(
      `id,
       created_at,
       job_title,
       contract_valid_from,
       contract_valid_until,
       status,
       pdf_url,
       first_party_id,
       second_party_id,
       promoter_id,
       parties!contracts_employer_id_fkey (id, name_en, name_ar),
       parties!contracts_client_id_fkey (id, name_en, name_ar),
       promoters (id, name_en, name_ar)`,
    )
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("Contract update failed, no data returned.")
  return data
}
