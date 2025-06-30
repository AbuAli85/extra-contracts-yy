import type { Contract, Party, Promoter } from "./types"
import type { ServerActionResponse } from "./dashboard-types"
// Only import the browser client statically
import { createClient as createBrowserClient } from "@/lib/supabase/client"

// Helper function to get the appropriate client based on execution context
async function getSupabaseClient() {
  // In a browser environment or when headers aren't available, use the browser client
  if (typeof window !== 'undefined') {
    return createBrowserClient()
  }
  
  // In a server environment, try to use the server client
  try {
    // Dynamically import the server client to prevent webpack from including it in client bundles
    const { createClient: createServerClient } = await import("@/lib/supabase/server")
    return createServerClient()
  } catch (error) {
    // Fall back to browser client if headers are not available
    console.warn('Falling back to browser client in server environment')
    return createBrowserClient()
  }
}

export async function getContractsData(
  query?: string,
  status?: string,
): Promise<ServerActionResponse<Contract[]>> {
  const supabase = await getSupabaseClient()
  
  // Rest of the function remains the same
  let dbQuery = supabase
    .from("contracts")
    .select(`
      id,
      contract_name,
      contract_type,
      start_date,
      end_date,
      contract_value,
      content_english,
      content_spanish,
      status,
      created_at,
      updated_at,
      parties_contracts_party_a_id_fkey(name),
      parties_contracts_party_b_id_fkey(name),
      promoters(name)
    `)
    .order("created_at", { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`contract_name.ilike.%${query}%,contract_type.ilike.%${query}%`)
  }

  if (status && status !== "all") {
    dbQuery = dbQuery.eq("status", status)
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error("Error fetching contracts:", error)
    return { success: false, message: `Failed to fetch contracts: ${error.message}` }
  }

  const contracts = (data || []).map((contract: any) => ({
    ...contract,
    party_a_name: contract.parties_contracts_party_a_id_fkey?.name || "N/A",
    party_b_name: contract.parties_contracts_party_b_id_fkey?.name || "N/A",
    promoter_name: contract.promoters?.name || "N/A",
  })) as Contract[]

  return { success: true, message: "Contracts fetched successfully", data: contracts }
}

// Update all other functions to use await getSupabaseClient()
export async function getContractById(id: string): Promise<ServerActionResponse<Contract>> {
  const supabase = await getSupabaseClient()
  
  // Rest of the function remains the same
  const { data, error } = await supabase
    .from("contracts")
    .select(`
      id,
      contract_name,
      contract_type,
      start_date,
      end_date,
      contract_value,
      content_english,
      content_spanish,
      status,
      created_at,
      updated_at,
      parties_contracts_party_a_id_fkey(name),
      parties_contracts_party_b_id_fkey(name),
      promoters(name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching contract:", error)
    return { success: false, message: `Failed to fetch contract: ${error.message}` }
  }

  if (!data) {
    return { success: false, message: "Contract not found" }
  }

  const contract = {
    ...data,
    party_a_name: (data as any).parties_contracts_party_a_id_fkey?.name || "N/A",
    party_b_name: (data as any).parties_contracts_party_b_id_fkey?.name || "N/A",
    promoter_name: (data as any).promoters?.name || "N/A",
  } as Contract

  return { success: true, message: "Contract fetched successfully", data: contract }
}

export async function getParties(): Promise<ServerActionResponse<Party[]>> {
  const supabase = await getSupabaseClient()
  
  // Rest of the function remains the same
  const { data, error } = await supabase.from("parties").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching parties:", error)
    return { success: false, message: `Failed to fetch parties: ${error.message}` }
  }
  return { success: true, message: "Parties fetched successfully", data: data as Party[] }
}

export async function getPartyById(id: string): Promise<ServerActionResponse<Party>> {
  const supabase = await getSupabaseClient()
  
  // Rest of the function remains the same
  const { data, error } = await supabase.from("parties").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching party:", error)
    return { success: false, message: `Failed to fetch party: ${error.message}` }
  }
  if (!data) {
    return { success: false, message: "Party not found" }
  }
  return { success: true, message: "Party fetched successfully", data: data as Party }
}

export async function getPromoters(): Promise<ServerActionResponse<Promoter[]>> {
  const supabase = await getSupabaseClient()
  
  // Rest of the function remains the same
  const { data, error } = await supabase.from("promoters").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching promoters:", error)
    return { success: false, message: `Failed to fetch promoters: ${error.message}` }
  }
  return { success: true, message: "Promoters fetched successfully", data: data as Promoter[] }
}

export async function getPromoterById(id: string): Promise<ServerActionResponse<Promoter>> {
  const supabase = await getSupabaseClient()
  
  // Rest of the function remains the same
  const { data, error } = await supabase.from("promoters").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching promoter:", error)
    return { success: false, message: `Failed to fetch promoter: ${error.message}` }
  }
  if (!data) {
    return { success: false, message: "Promoter not found" }
  }
  return { success: true, message: "Promoter fetched successfully", data: data as Promoter }
}
