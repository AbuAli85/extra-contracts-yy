import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import { useToast } from "@/hooks/use-toast"
import type { Promoter } from "@/types/custom"

const fetchPromoters = async (
  toastHook: ReturnType<typeof useToast>["toast"],
): Promise<Promoter[]> => {
  const { data, error } = await supabase
    .from("promoters")
    .select("*")
    .order("name_en", { ascending: true })
  if (error) {
    console.error("Error fetching promoters:", error)
    // Log the complete error object for easier debugging
    console.error(error)
    toastHook({
      title: "Error loading promoters",
      description: error.message,
      variant: "destructive",
    })
    throw new Error(error.message)
  }
  return data || []
}

export const usePromoters = () => {
  const { toast: toastHook } = useToast()
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["promoters"], [])

  const queryResult = useQuery<Promoter[], Error>({
    queryKey,
    queryFn: () => fetchPromoters(toastHook),
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
  }, [queryClient])

  return { ...queryResult, errorMessage: queryResult.error?.message }
}
