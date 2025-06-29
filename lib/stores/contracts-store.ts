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
  updateContract: (contract: Contract) => void
  addContract: (contract: Contract) => void
  fetchContracts: () => Promise<void>
  generateContract: (contractNumber: string) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  loading: false,
  error: null,

  setContracts: (contracts) => set({ contracts }),

  updateContract: (updatedContract) =>
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.contract_number === updatedContract.contract_number ? { ...contract, ...updatedContract } : contract,
      ),
    })),

  addContract: (contract) =>
    set((state) => ({
      contracts: [contract, ...state.contracts],
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
      console.error("Error fetching contracts:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to fetch contracts",
        loading: false,
      })
    }
  },

  generateContract: async (contractNumber) => {
    set({ loading: true, error: null })
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

      set({ loading: false })
    } catch (error) {
      console.error("Error generating contract:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to generate contract",
        loading: false,
      })
    }
  },
}))
