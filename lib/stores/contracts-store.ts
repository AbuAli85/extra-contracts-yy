import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface Contract {
  id: string
  contract_number: string
  title?: string
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  pdf_url?: string
  error_message?: string
  created_at: string
  updated_at: string
  party1_id?: string
  party2_id?: string
  contract_type?: string
  terms?: Record<string, any>
  created_by?: string
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
}

interface ContractsActions {
  fetchContracts: () => Promise<void>
  generateContract: (contractNumber: string) => Promise<void>
  retryContract: (contractNumber: string) => Promise<void>
  downloadContract: (pdfUrl: string, contractNumber: string) => void
  updateContract: (contract: Contract) => void
  setContracts: (contracts: Contract[]) => void
  calculateStatistics: () => void
}

type ContractsStore = ContractsState & ContractsActions

export const useContractsStore = create<ContractsStore>((set, get) => ({
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

  fetchContracts: async () => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({ contracts: data || [], loading: false })
      get().calculateStatistics()
    } catch (error) {
      console.error("Error fetching contracts:", error)
      set({ error: "Failed to fetch contracts", loading: false })
      toast.error("Failed to fetch contracts")
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate contract")
      }

      toast.success("Contract generation started!")
      get().fetchContracts()
    } catch (error) {
      console.error("Error generating contract:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate contract")
    }
  },

  retryContract: async (contractNumber: string) => {
    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract_number: contractNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to retry contract")
      }

      toast.success("Contract retry started!")
      get().fetchContracts()
    } catch (error) {
      console.error("Error retrying contract:", error)
      toast.error(error instanceof Error ? error.message : "Failed to retry contract")
    }
  },

  downloadContract: (pdfUrl: string, contractNumber: string) => {
    try {
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = `contract-${contractNumber}.pdf`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Download started!")
    } catch (error) {
      console.error("Error downloading contract:", error)
      toast.error("Failed to download contract")
    }
  },

  updateContract: (updatedContract: Contract) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.contract_number === updatedContract.contract_number ? updatedContract : contract,
      ),
    }))
    get().calculateStatistics()
  },

  setContracts: (contracts: Contract[]) => {
    set({ contracts })
    get().calculateStatistics()
  },

  calculateStatistics: () => {
    const { contracts } = get()
    const statistics = {
      total: contracts.length,
      pending: contracts.filter((c) => c.status === "pending").length,
      queued: contracts.filter((c) => c.status === "queued").length,
      processing: contracts.filter((c) => c.status === "processing").length,
      completed: contracts.filter((c) => c.status === "completed").length,
      failed: contracts.filter((c) => c.status === "failed").length,
    }
    set({ statistics })
  },
}))
