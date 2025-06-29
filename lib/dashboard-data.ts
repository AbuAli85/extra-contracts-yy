import { createClient } from "@/lib/supabase/server"
import type {
  DashboardSummary,
  ContractTrend,
  ContractStatusDistribution,
  AuditLog,
  Review,
  AdminAction,
  User,
  Contract,
} from "./dashboard-types"
import { format, subMonths } from "date-fns"

const supabase = createClient()

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data: totalContractsData, error: totalContractsError } = await supabase
    .from("contracts")
    .select("count", { count: "exact" })

  const { data: activeContractsData, error: activeContractsError } = await supabase
    .from("contracts")
    .select("count", { count: "exact" })
    .eq("status", "Active") // Assuming 'Active' is a status

  const { data: pendingContractsData, error: pendingContractsError } = await supabase
    .from("contracts")
    .select("count", { count: "exact" })
    .eq("status", "Pending Review") // Assuming 'Pending Review' is a status

  if (totalContractsError || activeContractsError || pendingContractsError) {
    console.error(
      "Error fetching dashboard summary:",
      totalContractsError || activeContractsError || pendingContractsError,
    )
    // Return default values or throw an error based on your error handling strategy
    return {
      totalContracts: 0,
      activeContracts: 0,
      pendingContracts: 0,
    }
  }

  return {
    totalContracts: totalContractsData?.[0]?.count || 0,
    activeContracts: activeContractsData?.[0]?.count || 0,
    pendingContracts: pendingContractsData?.[0]?.count || 0,
  }
}

export async function getContractTrends(): Promise<ContractTrend[]> {
  // This is a simplified mock. In a real app, you'd query your database
  // for contract creation/completion dates and aggregate them by month.
  const trends: ContractTrend[] = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const month = subMonths(now, i)
    const monthName = format(month, "MMM yyyy")
    // Mock data: random numbers for demonstration
    trends.push({
      month: monthName,
      newContracts: Math.floor(Math.random() * 20) + 5,
      completedContracts: Math.floor(Math.random() * 15) + 3,
    })
  }
  return trends
}

export async function getContractStatusDistribution(): Promise<ContractStatusDistribution[]> {
  // This is a simplified mock. In a real app, you'd query your database
  // to count contracts by their status.
  const { data, error } = await supabase.from("contracts").select("status, count", { count: "exact" }).order("status")

  if (error) {
    console.error("Error fetching contract status distribution:", error)
    return []
  }

  // Transform Supabase count data into the desired format
  const distribution: ContractStatusDistribution[] = data.map((row: any) => ({
    name: row.status,
    count: row.count,
  }))

  return distribution
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  // This is a simplified mock. In a real app, you'd query your audit log table.
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching audit logs:", error)
    return []
  }

  return data.map((log) => ({
    id: log.id,
    timestamp: log.timestamp,
    user: log.user_email || "System",
    action: log.action,
    target: log.target || "N/A",
    details: log.details || "No additional details",
  })) as AuditLog[]
}

export async function getPendingReviews(): Promise<Review[]> {
  // This is a simplified mock. In a real app, you'd query for items needing review.
  const { data, error } = await supabase
    .from("contracts")
    .select("id, contract_name, created_at, user_id")
    .eq("status", "Pending Review")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching pending reviews:", error)
    return []
  }

  return data.map((contract) => ({
    id: contract.id,
    title: `Contract: ${contract.contract_name}`,
    description: `Submitted by user ${contract.user_id?.substring(0, 8)}... for review.`,
    avatar: "/placeholder-user.png", // Placeholder avatar
    submitter: `User ${contract.user_id?.substring(0, 8)}...`,
    period: format(new Date(contract.created_at), "PPP"),
  })) as Review[]
}

export async function getAdminActions(): Promise<AdminAction[]> {
  // Mock data for admin actions
  return [
    { id: "1", name: "Run Database Migration", description: "Apply latest schema changes." },
    { id: "2", name: "Clear Cache", description: "Clear application cache for all users." },
    { id: "3", name: "Generate Report", description: "Generate a comprehensive system report." },
  ]
}

export async function getNotifications(): Promise<Notification[]> {
  // This is a simplified mock. In a real app, you'd query your notifications table.
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data.map((n) => ({
    id: n.id,
    type: n.type,
    message: n.message,
    timestamp: n.created_at,
    isRead: n.is_read,
  })) as Notification[]
}

// Placeholder for getContractsByPromoter
export async function getContractsByPromoter(promoterId: string): Promise<Contract[]> {
  console.log(`Fetching contracts for promoter: ${promoterId}`)
  // In a real application, you would query your database for contracts
  // associated with the given promoterId.
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
    .eq("promoter_id", promoterId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contracts by promoter:", error)
    return []
  }

  return data.map((contract: any) => ({
    ...contract,
    party_a_name: contract.parties_contracts_party_a_id_fkey?.name || "N/A",
    party_b_name: contract.parties_contracts_party_b_id_fkey?.name || "N/A",
    promoter_name: contract.promoters?.name || "N/A",
  })) as Contract[]
}

// Placeholder for getReviewItems
export async function getReviewItems(): Promise<Review[]> {
  console.log("Fetching review items...")
  // This would typically fetch items from a 'reviews' table or
  // filter existing data based on a 'needs_review' flag.
  return [
    {
      id: "review-1",
      title: "Contract #001 - Pending Approval",
      description: "Review required for new sales contract with Client X.",
      avatar: "/placeholder-user.png",
      submitter: "Admin User",
      period: "2023-10-26",
    },
    {
      id: "review-2",
      title: "Promoter Profile Update",
      description: "Promoter 'John Doe' updated their profile. Needs verification.",
      avatar: "/placeholder-user.png",
      submitter: "Promoter John",
      period: "2023-10-25",
    },
  ]
}

// Placeholder for getUsers
export async function getUsers(): Promise<User[]> {
  console.log("Fetching users...")
  // In a real application, you would query your Supabase auth.users table
  // or a custom 'profiles' table linked to auth.users.
  const { data, error } = await supabase.from("profiles").select("id, email, role, created_at").limit(10)

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data.map((user: any) => ({
    id: user.id,
    email: user.email,
    role: user.role || "user", // Default role if not specified
    createdAt: user.created_at,
  })) as User[]
}
