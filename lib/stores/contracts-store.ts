import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface Contract {
  id: string
  title: string
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  created_at: string
  updated_at: string
  pdf_url?: string
  error_message?: string
  contract_data?: any
}

interface ContractsState {
  contracts: Contract[]
  isLoading: boolean
  error: string | null
  stats: {
    total: number
    pending: number
    completed: number
    failed: number
  }

  // Actions
  fetchContracts: () => Promise<void>
  generateContract: (data: any) => Promise<void>
  retryContract: (id: string) => Promise<void>
  downloadContract: (id: string) => Promise<void>
  updateContract: (id: string, updates: Partial<Contract>) => void
  calculateStats: () => void
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  isLoading: false,
  error: null,
  stats: {
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
  },

  fetchContracts: async () => {
    set({ isLoading: true, error: null })

    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({ contracts: data || [], isLoading: false })
      get().calculateStats()
    } catch (error) {
      console.error("Error fetching contracts:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to fetch contracts",
        isLoading: false,
      })
    }
  },

  generateContract: async (contractData: any) => {
    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contractData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate contract")
      }

      const result = await response.json()
      toast.success("Contract generation started!")

      // Refresh contracts to show the new one
      await get().fetchContracts()
    } catch (error) {
      console.error("Error generating contract:", error)
      toast.error("Failed to generate contract")
      throw error
    }
  },

  retryContract: async (id: string) => {
    try {
      const contract = get().contracts.find((c) => c.id === id)
      if (!contract) return

      await get().generateContract(contract.contract_data)
      toast.success("Contract retry initiated!")
    } catch (error) {
      console.error("Error retrying contract:", error)
      toast.error("Failed to retry contract")
    }
  },

  downloadContract: async (id: string) => {
    try {
      const contract = get().contracts.find((c) => c.id === id)
      if (!contract?.pdf_url) {
        toast.error("PDF not available")
        return
      }

      // Create a temporary link to download the file
      const link = document.createElement("a")
      link.href = contract.pdf_url
      link.download = `contract-${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Download started!")
    } catch (error) {
      console.error("Error downloading contract:", error)
      toast.error("Failed to download contract")
    }
  },

  updateContract: (id: string, updates: Partial<Contract>) => {
    set((state) => ({
      contracts: state.contracts.map((contract) => (contract.id === id ? { ...contract, ...updates } : contract)),
    }))
    get().calculateStats()
  },

  calculateStats: () => {
    const contracts = get().contracts
    const stats = {
      total: contracts.length,
      pending: contracts.filter((c) => c.status === "pending" || c.status === "queued" || c.status === "processing")
        .length,
      completed: contracts.filter((c) => c.status === "completed").length,
      failed: contracts.filter((c) => c.status === "failed").length,
    }
    set({ stats })
  },
}))
