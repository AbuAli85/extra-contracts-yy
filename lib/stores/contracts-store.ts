import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"

export interface Contract {
  id: string
  user_id: string
  status: "pending" | "processing" | "completed" | "failed"
  contract_type: string
  parties: Array<{
    id: string
    name: string
    type: "individual" | "company"
    email?: string
    address?: string
  }>
  terms: Record<string, any>
  language: "en" | "es" | "both"
  pdf_url?: string
  error_message?: string
  created_at: string
  updated_at: string
}

interface ContractsState {
  contracts: Contract[]
  loading: boolean
  error: string | null

  // Actions
  fetchContracts: () => Promise<void>
  generateContract: (contractData: any) => Promise<string | null>
  retryContract: (contractId: string) => Promise<void>
  downloadContract: (contractId: string) => Promise<void>
  updateContract: (contractId: string, updates: Partial<Contract>) => void
  addContract: (contract: Contract) => void
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  loading: false,
  error: null,

  fetchContracts: async () => {
    set({ loading: true, error: null })

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      set({ contracts: data || [], loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch contracts",
        loading: false,
      })
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
        body: JSON.stringify({ contractData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate contract")
      }

      const result = await response.json()

      // Refresh contracts list
      await get().fetchContracts()

      set({ loading: false })
      return result.contractId
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to generate contract",
        loading: false,
      })
      return null
    }
  },

  retryContract: async (contractId) => {
    try {
      const contract = get().contracts.find((c) => c.id === contractId)
      if (!contract) return

      // Reset status to pending
      get().updateContract(contractId, {
        status: "pending",
        error_message: undefined,
        updated_at: new Date().toISOString(),
      })

      // Trigger regeneration
      await get().generateContract({
        parties: contract.parties,
        contractType: contract.contract_type,
        terms: contract.terms,
        language: contract.language,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to retry contract",
      })
    }
  },

  downloadContract: async (contractId) => {
    try {
      const contract = get().contracts.find((c) => c.id === contractId)
      if (!contract?.pdf_url) {
        throw new Error("PDF not available")
      }

      // Create a temporary link to download the PDF
      const link = document.createElement("a")
      link.href = contract.pdf_url
      link.download = `contract-${contractId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to download contract",
      })
    }
  },

  updateContract: (contractId, updates) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === contractId ? { ...contract, ...updates } : contract,
      ),
    }))
  },

  addContract: (contract) => {
    set((state) => ({
      contracts: [contract, ...state.contracts],
    }))
  },
}))
