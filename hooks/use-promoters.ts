import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import { useToast } from "@/hooks/use-toast"
import type { Promoter } from "@/types/custom"

const fetchPromoters = async (): Promise<Promoter[]> => {
  const { data, error } = await supabase
    .from("promoters")
    .select("*")
    .order("name_en", { ascending: true })

  if (error) {
    console.error("Error fetching promoters:", error)
    // Log the complete error object for easier debugging
    console.error(error)
    throw new Error(error.message)
  }
  return data || []
}

export const usePromoters = () => {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["promoters"], [])
  const { toast } = useToast()

  const queryResult = useQuery<Promoter[], Error>({
    queryKey,
    queryFn: fetchPromoters,
    staleTime: 1000 * 60 * 5,
    retry: false,
    onError: (error) => {
      toast({
        title: "Error loading promoters",
        description: error.message,
        variant: "destructive",
      })
    },
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
          const message = err?.message ?? "Unknown channel error"
          console.error(`Promoters channel error (${status}):`, message)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, queryKey])

  return { ...queryResult, errorMessage: queryResult.error?.message }
}
