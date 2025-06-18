import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import { toast } from "sonner"
import type { Promoter } from "@/types/custom"

const supabase = createBrowserClient()

const fetchPromoters = async (): Promise<Promoter[]> => {
  const { data, error } = await supabase
    .from("promoters")
    .select("*")
    .order("name_en", { ascending: true })
  if (error) {
    console.error("Error fetching promoters:", error)
    toast.error("Error loading promoters", { description: error.message })
    throw new Error(error.message)
  }
  return data || []
}

export const usePromoters = () => {
  const queryClient = useQueryClient()
  const queryKey = ["promoters"]

  const queryResult = useQuery<Promoter[], Error>({
    queryKey,
    queryFn: fetchPromoters,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    const channel = supabase
      .channel("public-promoters-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "promoters" },
        (payload) => {
          devLog("Realtime promoter change received!", payload)
          queryClient.invalidateQueries({ queryKey })
        },
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Promoters channel error:", err)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, queryKey])

  return queryResult
}
