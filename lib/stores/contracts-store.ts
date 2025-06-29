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
  setContracts: (contracts: Contract[]) => void
  addContract: (contract: Contract) => void
  updateContract: (contract: Contract) => void
  removeContract: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchContracts: () => Promise<void>
  generateContract: (contractNumber: string) => Promise<void>
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  loading: false,
  error: null,

  setContracts: (contracts) => set({ contracts }),

  addContract: (contract) =>
    set((state) => ({
      contracts: [...state.contracts, contract],
    })),

  updateContract: (updatedContract) =>
    set((state) => ({
      contracts: state.contracts.map((contract) => (contract.id === updatedContract.id ? updatedContract : contract)),
    })),

  removeContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((contract) => contract.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  fetchContracts: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

      if (error) throw error
      set({ contracts: data || [], loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  generateContract: async (contractNumber: string) => {
    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract_number: contractNumber }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate contract")
      }

      // Contract status will be updated via real-time subscription
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },
}))
