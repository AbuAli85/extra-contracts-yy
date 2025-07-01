import type { ContractWithRelations } from "@/hooks/use-contracts"
import { createServerComponentClient } from "@/lib/supabaseServer"

export const getContract = async (contractId: string): Promise<ContractWithRelations | null> => {
  if (!contractId) {
    console.warn("getContract called with no contractId")
    return null
  }

  const supabase = await createServerComponentClient()

  const { data, error } = await supabase
    .from("contracts")
    .select(
      `
      *,
      promoter_name_en:promoter_id(name_en),
      promoter_name_ar:promoter_id(name_ar),
      parties!contracts_employer_id_fkey(id,name_en,name_ar),
      parties!contracts_client_id_fkey(id,name_en,name_ar),
      promoters(id,name_en,name_ar)
    `,
    )
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
