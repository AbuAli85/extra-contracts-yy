import { create } from "zustand"
import { toast } from "sonner"

export interface Contract {
  id: string
  contract_number: string
  party_a: string
  party_b: string
  contract_type: string
  description?: string
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  pdf_url?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface ContractFormData {
  party_a: string
  party_b: string
  contract_type: string
  description?: string
}

interface ContractsState {
  contracts: Contract[]
  isLoading: boolean
  error: string | null

  // Actions
  setContracts: (contracts: Contract[]) => void
  addContract: (contract: Contract) => void
  updateContract: (id: string, updates: Partial<Contract>) => void
  removeContract: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // API actions
  generateContract: (data: ContractFormData) => Promise<void>
  retryContract: (id: string) => Promise<void>
  downloadContract: (contract: Contract) => Promise<void>

  // Statistics
  getStatistics: () => {
    total: number
    pending: number
    completed: number
    failed: number
  }
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  isLoading: false,
  error: null,

  setContracts: (contracts) => set({ contracts }),

  addContract: (contract) =>
    set((state) => ({
      contracts: [contract, ...state.contracts],
    })),

  updateContract: (id, updates) =>
    set((state) => ({
      contracts: state.contracts.map((contract) => (contract.id === id ? { ...contract, ...updates } : contract)),
    })),

  removeContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((contract) => contract.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  generateContract: async (data) => {
    set({ isLoading: true, error: null })

    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to generate contract")
      }

      const result = await response.json()

      if (result.success) {
        get().addContract(result.contract)
        toast.success("Contract generation started successfully!")
      } else {
        throw new Error(result.error || "Failed to generate contract")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage })
      toast.error(errorMessage)
    } finally {
      set({ isLoading: false })
    }
  },

  retryContract: async (id) => {
    const contract = get().contracts.find((c) => c.id === id)
    if (!contract) return

    set({ isLoading: true, error: null })

    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          party_a: contract.party_a,
          party_b: contract.party_b,
          contract_type: contract.contract_type,
          description: contract.description,
          retry_id: id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to retry contract generation")
      }

      const result = await response.json()

      if (result.success) {
        get().updateContract(id, { status: "pending" })
        toast.success("Contract retry initiated successfully!")
      } else {
        throw new Error(result.error || "Failed to retry contract generation")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage })
      toast.error(errorMessage)
    } finally {
      set({ isLoading: false })
    }
  },

  downloadContract: async (contract) => {
    if (!contract.pdf_url) {
      toast.error("PDF not available for download")
      return
    }

    try {
      const response = await fetch(contract.pdf_url)
      if (!response.ok) throw new Error("Failed to download PDF")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `contract-${contract.contract_number}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Contract downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download contract")
    }
  },

  getStatistics: () => {
    const contracts = get().contracts
    return {
      total: contracts.length,
      pending: contracts.filter((c) => c.status === "pending" || c.status === "queued" || c.status === "processing")
        .length,
      completed: contracts.filter((c) => c.status === "completed").length,
      failed: contracts.filter((c) => c.status === "failed").length,
    }
  },
}))
