import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createParty, getParties, deleteParty } from "@/app/actions/parties"

// Query hook for fetching all parties
export function useParties() {
  return useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const response = await getParties()
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
  })
}

// Mutation hook for creating a party
export function useCreatePartyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await createParty(null, formData)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] })
    },
  })
}

// Mutation hook for deleting a party
export function useDeletePartyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteParty(id)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] })
    },
  })
}
