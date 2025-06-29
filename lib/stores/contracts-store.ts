"use client"

import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface Contract {
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
  error_message?: string
}

interface ContractsState {
  contracts: Contract[]
  loading: boolean
  error: string | null
  statistics: {
    total: number
    pending: number
    queued: number
    processing: number
    completed: number
    failed: number
  }
  setContracts: (contracts: Contract[]) => void
  addContract: (contract: Contract) => void
  updateContract: (contract: Contract) => void
  removeContract: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchContracts: () => Promise<void>
  generateContract: (contractData: Partial<Contract>) => Promise<void>
  retryContract: (contractNumber: string) => Promise<void>
  downloadContract: (contract: Contract) => void
  calculateStatistics: () => void
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  loading: false,
  error: null,
  statistics: {
    total: 0,
    pending: 0,
    queued: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  },

  setContracts: (contracts) => {
    set({ contracts })
    get().calculateStatistics()
  },

  addContract: (contract) => {
    set((state) => ({
      contracts: [contract, ...state.contracts],
    }))
    get().calculateStatistics()
  },

  updateContract: (updatedContract) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.contract_number === updatedContract.contract_number ? { ...contract, ...updatedContract } : contract,
      ),
    }))
    get().calculateStatistics()

    // Show toast notification for status changes
    if (updatedContract.status === "completed") {
      toast.success(`Contract ${updatedContract.contract_number} completed successfully!`)
    } else if (updatedContract.status === "failed") {
      toast.error(`Contract ${updatedContract.contract_number} failed to generate`)
    }
  },

  removeContract: (id) => {
    set((state) => ({
      contracts: state.contracts.filter((contract) => contract.id !== id),
    }))
    get().calculateStatistics()
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  fetchContracts: async () => {
    const supabase = createClient()
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({ contracts: data || [], loading: false })
      get().calculateStatistics()
    } catch (error) {
      console.error("Error fetching contracts:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to fetch contracts",
        loading: false,
      })
      toast.error("Failed to fetch contracts")
    }
  },

  generateContract: async (contractData) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contractData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate contract")
      }

      const result = await response.json()
      console.log("Contract generation initiated:", result)

      toast.success("Contract generation started!")

      // Refresh contracts to get updated status
      await get().fetchContracts()
      set({ loading: false })
    } catch (error) {
      console.error("Error generating contract:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate contract"
      set({
        error: errorMessage,
        loading: false,
      })
      toast.error(errorMessage)
    }
  },

  retryContract: async (contractNumber: string) => {
    await get().generateContract({ contract_number: contractNumber })
  },

  downloadContract: (contract: Contract) => {
    if (contract.pdf_url) {
      window.open(contract.pdf_url, "_blank")
      toast.success("Opening contract PDF...")
    } else {
      toast.error("PDF not available for this contract")
    }
  },

  calculateStatistics: () => {
    const { contracts } = get()
    const stats = {
      total: contracts.length,
      pending: contracts.filter((c) => c.status === "pending").length,
      queued: contracts.filter((c) => c.status === "queued").length,
      processing: contracts.filter((c) => c.status === "processing").length,
      completed: contracts.filter((c) => c.status === "completed").length,
      failed: contracts.filter((c) => c.status === "failed").length,
    }
    set({ statistics: stats })
  },
}))
