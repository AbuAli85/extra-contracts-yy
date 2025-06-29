import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Promoter } from "@/lib/types"

const supabase = createClient()

// Fetch all promoters
export function usePromoters(query?: string) {
  return useQuery<Promoter[], Error>({
    queryKey: ["promoters", query],
    queryFn: async () => {
      let dbQuery = supabase.from("promoters").select("*")

      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,company_name.ilike.%${query}%`)
      }

      const { data, error } = await dbQuery
      if (error) throw error
      return data as Promoter[]
    },
  })
}

// Fetch a single promoter by ID
export function usePromoter(id: string) {
  return useQuery<Promoter, Error>({
    queryKey: ["promoter", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("promoters").select("*").eq("id", id).single()
      if (error) throw error
      return data as Promoter
    },
  })
}

// Create a new promoter
export function useCreatePromoterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newPromoter: Omit<Promoter, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("promoters").insert([newPromoter]).select().single()
      if (error) throw error
      return { success: true, message: "Promoter created successfully!", data: data as Promoter }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoters"] })
    },
  })
}

// Update an existing promoter
export function useUpdatePromoterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updatedPromoter: Partial<Promoter> & { id: string }) => {
      const { id, ...updates } = updatedPromoter
      const { data, error } = await supabase.from("promoters").update(updates).eq("id", id).select().single()
      if (error) throw error
      return { success: true, message: "Promoter updated successfully!", data: data as Promoter }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["promoter", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["promoters"] })
    },
  })
}

// Delete a promoter
export function useDeletePromoterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promoters").delete().eq("id", id)
      if (error) throw error
      return { success: true, message: "Promoter deleted successfully!" }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoters"] })
    },
  })
}
