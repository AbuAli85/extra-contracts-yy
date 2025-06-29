import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Contract } from "@/lib/types"
import {
  createContract as createContractAction,
  updateContract as updateContractAction,
  deleteContract as deleteContractAction,
} from "@/app/actions/contracts"

const supabase = createClient()

// Fetch all contracts
export function useContracts(query?: string, status?: string) {
  return useQuery<Contract[], Error>({
    queryKey: ["contracts", query, status],
    queryFn: async () => {
      let dbQuery = supabase.from("contracts").select("*")

      if (query) {
        dbQuery = dbQuery.or(`contract_name.ilike.%${query}%,contract_type.ilike.%${query}%`)
      }

      if (status && status !== "all") {
        dbQuery = dbQuery.eq("status", status)
      }

      const { data, error } = await dbQuery
      if (error) throw error
      return data as Contract[]
    },
  })
}

// Fetch a single contract by ID
export function useContract(id: string) {
  return useQuery<Contract, Error>({
    queryKey: ["contract", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("contracts").select("*").eq("id", id).single()
      if (error) throw error
      return data as Contract
    },
  })
}

// Create a new contract
export function useCreateContractMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createContractAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
    },
  })
}

// Update an existing contract
export function useUpdateContractMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateContractAction(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contract", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
    },
  })
}

// Delete a contract
export function useDeleteContractMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteContractAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
    },
  })
}
