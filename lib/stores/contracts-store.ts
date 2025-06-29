import { create } from "zustand"
import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface Contract {
  id: string
  contract_number: string
  party1_id?: string
  party2_id?: string
  contract_type?: string
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  pdf_url?: string
  error_message?: string
  created_at: string
  updated_at: string
}

export interface ContractStats {
  total: number
  pending: number
  queued: number
  processing: number
  completed: number
  failed: number
}

interface ContractsState {
  contracts: Contract[]
  loading: boolean
  error: string | null
  stats: ContractStats

  // Actions
  fetchContracts: () => Promise<void>
  generateContract: (data: {
    contract_number: string
    party1_id?: string
    party2_id?: string
    contract_type?: string
  }) => Promise<void>
  retryContract: (contract_number: string) => Promise<void>
  downloadContract: (pdf_url: string, contract_number: string) => void
  updateContract: (contract: Contract) => void
  calculateStats: () => void
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  loading: false,
  error: null,
  stats: {
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
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({ contracts: data || [], loading: false })
      get().calculateStats()
    } catch (error) {
      console.error("Error fetching contracts:", error)
      set({
        error: "Failed to fetch contracts",
        loading: false,
      })
      toast.error("Failed to fetch contracts")
    }
  },

  generateContract: async (data) => {
    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate contract")
      }

      toast.success("Contract generation started")

      // Refresh contracts list
      await get().fetchContracts()
    } catch (error) {
      console.error("Error generating contract:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate contract")
    }
  },

  retryContract: async (contract_number) => {
    const contract = get().contracts.find((c) => c.contract_number === contract_number)
    if (!contract) return

    try {
      await get().generateContract({
        contract_number: contract.contract_number,
        party1_id: contract.party1_id,
        party2_id: contract.party2_id,
        contract_type: contract.contract_type,
      })
    } catch (error) {
      console.error("Error retrying contract:", error)
      toast.error("Failed to retry contract generation")
    }
  },

  downloadContract: (pdf_url, contract_number) => {
    try {
      const link = document.createElement("a")
      link.href = pdf_url
      link.download = `contract-${contract_number}.pdf`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Contract download started")
    } catch (error) {
      console.error("Error downloading contract:", error)
      toast.error("Failed to download contract")
    }
  },

  updateContract: (updatedContract) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.contract_number === updatedContract.contract_number ? updatedContract : contract,
      ),
    }))
    get().calculateStats()
  },

  calculateStats: () => {
    const contracts = get().contracts
    const stats: ContractStats = {
      total: contracts.length,
      pending: contracts.filter((c) => c.status === "pending").length,
      queued: contracts.filter((c) => c.status === "queued").length,
      processing: contracts.filter((c) => c.status === "processing").length,
      completed: contracts.filter((c) => c.status === "completed").length,
      failed: contracts.filter((c) => c.status === "failed").length,
    }
    set({ stats })
  },
}))
