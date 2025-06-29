import { create } from "zustand"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface Contract {
  id: string
  contract_number: string
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  pdf_url?: string
  created_at: string
  updated_at: string
  title?: string
  description?: string
}

interface ContractsState {
  contracts: Contract[]
  loading: boolean
  error: string | null
  fetchContracts: () => Promise<void>
  generateContract: (contractNumber: string) => Promise<void>
  updateContract: (contract: Contract) => void
  retryContract: (contractNumber: string) => Promise<void>
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  loading: false,
  error: null,

  fetchContracts: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({ contracts: data || [], loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch contracts",
        loading: false,
      })
    }
  },

  generateContract: async (contractNumber: string) => {
    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract_number: contractNumber }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate contract")
      }

      // Contract status will be updated via real-time subscription
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to generate contract",
      })
    }
  },

  updateContract: (updatedContract: Contract) => {
    set((state) => ({
      contracts: state.contracts.map((contract) => (contract.id === updatedContract.id ? updatedContract : contract)),
    }))
  },

  retryContract: async (contractNumber: string) => {
    const { generateContract } = get()
    await generateContract(contractNumber)
  },
}))
