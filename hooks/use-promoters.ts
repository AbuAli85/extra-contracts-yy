import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Promoter } from "@/types/custom"

const fetchPromoters = async (): Promise<Promoter[]> => {
  const { data, error } = await supabase.from("promoters").select("*").order("name_en", { ascending: true })
  if (error) {
    console.error("Error fetching promoters:", error)
    throw new Error(error.message)
  }
  return data || []
}

export const usePromoters = () => {
  return useQuery<Promoter[], Error>({
    queryKey: ["promoters"],
    queryFn: fetchPromoters,
  })
}
