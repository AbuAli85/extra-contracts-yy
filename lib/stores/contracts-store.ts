import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"

export interface Contract {
  id: string
  contract_number: string
  title?: string
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  pdf_url?: string
  error_message?: string
  created_at: string
  updated_at: string
  created_by?: string
  party1_id?: string
  party2_id?: string
  contract_type?: string
  terms?: Record<string, any>
}

interface ContractsState {
  contracts: Contract[]
  loading: boolean
  error: string | null

  // Actions
  fetchContracts: () => Promise<void>
  generateContract: (contractNumber: string) => Promise<void>
  retryContract: (contractNumber: string) => Promise<void>
  downloadContract: (contract: Contract) => void
  updateContract: (contract: Contract) => void
  addContract: (contract: Contract) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  loading: false,
  error: null,

  fetchContracts: async () => {
    set({ loading: true, error: null })

    try {
      const supabase = createClient()

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

  generateContract: async (contractNumber: string) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  retryContract: async (contractNumber: string) => {
    try {
      await get().generateContract(contractNumber)
    } catch (error) {
      console.error("Error retrying contract:", error)
      set({ error: "Failed to retry contract generation" })
    }
  },

  downloadContract: (contract: Contract) => {
    if (!contract.pdf_url) {
      set({ error: "PDF not available for download" })
      return
    }

    try {
      const link = document.createElement("a")
      link.href = contract.pdf_url
      link.download = `contract-${contract.contract_number}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading contract:", error)
      set({ error: "Failed to download contract" })
    }
  },

  updateContract: (updatedContract: Contract) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === updatedContract.id ? { ...contract, ...updatedContract } : contract,
      ),
    }))
  },

  addContract: (contract: Contract) => {
    set((state) => ({
      contracts: [contract, ...state.contracts],
    }))
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}))
