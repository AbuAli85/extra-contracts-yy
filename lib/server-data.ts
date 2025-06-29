// Server-only data fetching
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import type { AdminAction, DashboardAnalytics, Notification, PendingReview, User } from "./dashboard-types"
import type { Contract, Party, Promoter } from "./types"

// Mark this entire module as server-only
export const dynamic = 'force-dynamic'

// Server-side Supabase client
export function createServerSideClient() {
  const cookieStore = cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Dashboard data functions (server-only)
export async function getServerDashboardAnalytics(): Promise<DashboardAnalytics> {
  const supabase = createServerSideClient()
  // Implementation
  // ...
  return {} as DashboardAnalytics
}

export async function getServerNotifications(): Promise<Notification[]> {
  const supabase = createServerSideClient()
  // Implementation
  // ...
  return []
}

export async function getServerPendingReviews(): Promise<PendingReview[]> {
  const supabase = createServerSideClient()
  // Implementation
  // ...
  return []
}

export async function getServerAdminActions(): Promise<AdminAction[]> {
  const supabase = createServerSideClient()
  // Implementation
  // ...
  return []
}

// Contract data functions (server-only)
export async function getServerContractsData(query?: string, status?: string): Promise<Contract[]> {
  const supabase = createServerSideClient()
  
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
    return []
  }

  return data.map((contract: any) => ({
    ...contract,
    party_a_name: contract.parties_contracts_party_a_id_fkey?.name || "N/A",
    party_b_name: contract.parties_contracts_party_b_id_fkey?.name || "N/A",
    promoter_name: contract.promoters?.name || "N/A",
  })) as Contract[]
}

// Add other server-only data functions here...
