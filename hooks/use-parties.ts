import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase" // Your Supabase client instance
import type { Database } from "@/types/supabase" // Assuming generated Supabase types
import { useToast } from "@/hooks/use-toast"

// Define the structure of a Party based on your select query
export type Party = Pick<Database["public"]["Tables"]["parties"]["Row"], "id" | "name_en" | "name_ar" | "crn" | "type">

const fetchParties = async (partyType?: "Employer" | "Client"): Promise<Party[]> => {
  let query = supabase.from("parties").select("id, name_en, name_ar, crn, type").order("name_en", { ascending: true })

  if (partyType) {
    query = query.eq("type", partyType)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching parties:", error)
    throw new Error(error.message) // React Query will handle this error
  }
  return data || []
}

export const useParties = (partyType?: "Employer" | "Client") => {
  const { toast } = useToast()
  return useQuery<Party[], Error>({
    queryKey: ["parties", partyType || "all"], // Unique query key based on type
    queryFn: () => fetchParties(partyType),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    onError: (error) => {
      toast({
        title: "Error loading parties",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
