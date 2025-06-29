"use client"

import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"

interface Contract {
  id: string
  contract_number: string
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  pdf_url?: string
  created_at: string
  updated_at: string
  party_1_id?: string
  party_2_id?: string
  promoter_id?: string
  event_date?: string
  venue?: string
  fee_amount?: number
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
  retryContract: (contractNumber: string) => Promise<void>
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
      contracts: state.contracts.map((contract) =>
        contract.contract_number === updatedContract.contract_number ? { ...contract, ...updatedContract } : contract,
      ),
    })),

  removeContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((contract) => contract.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  fetchContracts: async () => {
    const supabase = createClient()
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
        throw new Error("Failed to generate contract")
      }

      const result = await response.json()
      console.log("Contract generation initiated:", result)

      // Refresh contracts to get updated status
      await get().fetchContracts()
    } catch (error) {
      console.error("Error generating contract:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to generate contract",
        loading: false,
      })
    }
  },

  retryContract: async (contractNumber: string) => {
    // Same as generate contract for retry
    await get().generateContract(contractNumber)
  },
}))
