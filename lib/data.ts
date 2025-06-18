import type { ContractWithRelations } from "@/types/custom"
import { supabaseServer } from "@/lib/supabase/server"

export const getContract = async (
  contractId: string,
): Promise<ContractWithRelations | null> => {
  if (!contractId) {
    console.warn("getContract called with no contractId")
    return null
  }

  const supabase = supabaseServer()

  const { data, error } = await supabase
    .from("contracts")
    .select(`
      id,
      contract_name,
      party_a_id,
      party_b_id,
      promoter_id,
      start_date,
      end_date,
      status,
      contract_terms_en,
      contract_terms_fr,
      created_at,
      updated_at,
      user_id,
      pdf_url, 
      party_a:parties!contracts_party_a_id_fkey(id, name, address, representative_name),
      party_b:parties!contracts_party_b_id_fkey(id, name, address, representative_name),
      promoter:promoters!contracts_promoter_id_fkey(id, name, contact_email)
    `)
    .eq("id", contractId)
    .single()

  if (error) {
    console.error("Error fetching contract:", error.message)
    // Consider how to handle errors. Throwing might be appropriate for React Query's error state.
    // If the error is because the contract doesn't exist (e.g., RLS or actual missing row),
    // Supabase often returns a specific error code or null data.
    if (error.code === "PGRST116") {
      // PGRST116: "The result contains 0 rows"
      return null // Contract not found
    }
    throw error
  }
  return data as ContractWithRelations | null
}
