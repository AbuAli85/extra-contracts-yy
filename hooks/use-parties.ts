import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Party } from "@/lib/types"

const supabase = createClient()

// Fetch all parties
export function useParties(query?: string) {
  return useQuery<Party[], Error>({
    queryKey: ["parties", query],
    queryFn: async () => {
      let dbQuery = supabase.from("parties").select("*")

      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      }

      const { data, error } = await dbQuery
      if (error) throw error
      return data as Party[]
    },
  })
}

// Fetch a single party by ID
export function useParty(id: string) {
  return useQuery<Party, Error>({
    queryKey: ["party", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("parties").select("*").eq("id", id).single()
      if (error) throw error
      return data as Party
    },
  })
}

// Create a new party
export function createParty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newParty: Omit<Party, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("parties").insert([newParty]).select().single()
      if (error) throw error
      return { success: true, message: "Party created successfully!", data: data as Party }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] })
    },
  })
}

// Update an existing party
export function updateParty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updatedParty: Partial<Party> & { id: string }) => {
      const { id, ...updates } = updatedParty
      const { data, error } = await supabase.from("parties").update(updates).eq("id", id).select().single()
      if (error) throw error
      return { success: true, message: "Party updated successfully!", data: data as Party }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["party", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["parties"] })
    },
  })
}

// Delete a party
export function deleteParty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("parties").delete().eq("id", id)
      if (error) throw error
      return { success: true, message: "Party deleted successfully!" }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] })
    },
  })
}
