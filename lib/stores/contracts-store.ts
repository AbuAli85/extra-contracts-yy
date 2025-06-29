import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"

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

  removeContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((contract) => contract.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  fetchContracts: async () => {
    const { setLoading, setError, setContracts } = get()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setContracts(data || [])
    } catch (error) {
      console.error("Error fetching contracts:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch contracts")
    } finally {
      setLoading(false)
    }
  },

  generateContract: async (contractNumber: string) => {
    const { setError } = get()
    setError(null)

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

      // The contract status will be updated via real-time subscription
    } catch (error) {
      console.error("Error generating contract:", error)
      setError(error instanceof Error ? error.message : "Failed to generate contract")
    }
  },
}))
