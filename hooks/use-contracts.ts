import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createContract, getContracts, getContractById, updateContract, deleteContract } from "@/app/actions/contracts"

// Query hook for fetching all contracts
export function useContracts() {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const response = await getContracts()
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
  })
}

// Query hook for fetching a single contract by ID
export function useContract(id: string) {
  return useQuery({
    queryKey: ["contracts", id],
    queryFn: async () => {
      const response = await getContractById(id)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    enabled: !!id, // Only run query if id is available
  })
}

// Mutation hook for creating a contract
export function useCreateContractMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await createContract(null, formData)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
    },
  })
}

// Mutation hook for updating a contract
export function useUpdateContractMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await updateContract(id, null, formData)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contracts", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
    },
  })
}

// Mutation hook for deleting a contract
export function useDeleteContractMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteContract(id)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
    },
  })
}
