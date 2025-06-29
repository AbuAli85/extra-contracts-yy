import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createPromoter, getPromoters, getPromoterById, updatePromoter, deletePromoter } from "@/app/actions/promoters"

// Query hook for fetching all promoters
export function usePromoters() {
  return useQuery({
    queryKey: ["promoters"],
    queryFn: async () => {
      const response = await getPromoters()
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
  })
}

// Query hook for fetching a single promoter by ID
export function usePromoter(id: string) {
  return useQuery({
    queryKey: ["promoters", id],
    queryFn: async () => {
      const response = await getPromoterById(id)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    enabled: !!id, // Only run query if id is available
  })
}

// Mutation hook for creating a promoter
export function useCreatePromoterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await createPromoter(null, formData)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoters"] })
    },
  })
}

// Mutation hook for updating a promoter
export function useUpdatePromoterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await updatePromoter(id, null, formData)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["promoters", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["promoters"] })
    },
  })
}

// Mutation hook for deleting a promoter
export function useDeletePromoterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deletePromoter(id)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoters"] })
    },
  })
}
