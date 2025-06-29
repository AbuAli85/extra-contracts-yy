import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"

interface Contract {
  id: string
  contract_number: string
  contract_name: string
  party_a: string
  party_b: string
  contract_type: string
  terms: string
  status: string
  pdf_url?: string
  created_at: string
  updated_at: string
}

interface ContractsStore {
  contracts: Contract[]
  loading: boolean
  statistics: {
    total: number
    pending: number
    completed: number
    failed: number
  }
  fetchContracts: () => Promise<void>
  generateContract: (
    data: Omit<Contract, "id" | "contract_number" | "status" | "created_at" | "updated_at">,
  ) => Promise<void>
  retryContract: (contractId: string) => Promise<void>
  updateStatistics: () => Promise<void>
}

export const useContractsStore = create<ContractsStore>((set, get) => ({
  contracts: [],
  loading: false,
  statistics: {
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
  },

  fetchContracts: async () => {
    set({ loading: true })
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({ contracts: data || [] })
      get().updateStatistics()
    } catch (error) {
      console.error("Error fetching contracts:", error)
    } finally {
      set({ loading: false })
    }
  },

  generateContract: async (contractData) => {
    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contractData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate contract")
      }

      // Refresh contracts list
      get().fetchContracts()
    } catch (error) {
      console.error("Error generating contract:", error)
      throw error
    }
  },

  retryContract: async (contractId) => {
    try {
      const supabase = createClient()

      // Update status to generating
      const { error } = await supabase.from("contracts").update({ status: "generating" }).eq("id", contractId)

      if (error) throw error

      // Get contract data for retry
      const { data: contract } = await supabase.from("contracts").select("*").eq("id", contractId).single()

      if (contract && process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL) {
        // Send to Make.com webhook for reprocessing
        await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contractId: contract.id,
            contractNumber: contract.contract_number,
            contract_name: contract.contract_name,
            party_a: contract.party_a,
            party_b: contract.party_b,
            contract_type: contract.contract_type,
            terms: contract.terms,
            retry: true,
          }),
        })
      }

      // Refresh contracts list
      get().fetchContracts()
    } catch (error) {
      console.error("Error retrying contract:", error)
      throw error
    }
  },

  updateStatistics: async () => {
    const { contracts } = get()
    const statistics = {
      total: contracts.length,
      pending: contracts.filter((c) => c.status === "generating" || c.status === "pending").length,
      completed: contracts.filter((c) => c.status === "completed").length,
      failed: contracts.filter((c) => c.status === "failed").length,
    }
    set({ statistics })
  },
}))
