import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import { withRetry, logError, getErrorMessage } from "@/lib/error-handler"

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
  error: string | null
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
  clearError: () => void
}

export const useContractsStore = create<ContractsStore>((set, get) => ({
  contracts: [],
  loading: false,
  error: null,
  statistics: {
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
  },

  clearError: () => set({ error: null }),

  fetchContracts: async () => {
    set({ loading: true, error: null })
    try {
      await withRetry(async () => {
        const supabase = createClient()
        const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

        if (error) throw error

        set({ contracts: data || [] })
        get().updateStatistics()
      }, 3, 1000)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      logError(error, { context: "fetchContracts" })
      set({ error: errorMessage })
    } finally {
      set({ loading: false })
    }
  },

  generateContract: async (contractData) => {
    set({ error: null })
    try {
      await withRetry(async () => {
        const response = await fetch("/api/generate-contract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contractData),
        })

        if (!response.ok) {
          const errorData = await response.text()
          throw new Error(errorData || "Failed to generate contract")
        }
      }, 2, 2000)

      // Refresh contracts list
      get().fetchContracts()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      logError(error, { context: "generateContract", contractData })
      set({ error: errorMessage })
      throw error
    }
  },

  retryContract: async (contractId) => {
    set({ error: null })
    try {
      await withRetry(async () => {
        const supabase = createClient()

        // Update status to generating
        const { error } = await supabase.from("contracts").update({ status: "generating" }).eq("id", contractId)

        if (error) throw error

        // Get contract data for retry
        const { data: contract } = await supabase.from("contracts").select("*").eq("id", contractId).single()

        if (contract && process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL) {
          // Send to Make.com webhook for reprocessing
          const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL, {
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

          if (!response.ok) {
            throw new Error("Failed to send retry request to webhook")
          }
        }
      }, 3, 2000)

      // Refresh contracts list
      get().fetchContracts()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      logError(error, { context: "retryContract", contractId })
      set({ error: errorMessage })
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
