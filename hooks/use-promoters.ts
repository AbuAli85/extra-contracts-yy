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

export const usePromoters = (enableRealtime: boolean = true) => {
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

  // --- Realtime subscription ---
  useEffect(() => {
    if (!enableRealtime) {
      console.log("Realtime disabled for promoters")
      return
    }

    let retryCount = 0
    const maxRetries = 3
    let retryTimeout: NodeJS.Timeout
    let isSubscribed = false

    const setupSubscription = () => {
      if (isSubscribed) return

    const channel = supabase
      .channel("public-promoters-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "promoters" }, (payload) => {
        devLog("Realtime promoter change received!", payload)
          queryClient.invalidateQueries({ queryKey: queryKey })
      })
      .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            devLog("Subscribed to promoters channel!")
            retryCount = 0 // Reset retry count on successful connection
            isSubscribed = true
          }
        if (status === "CHANNEL_ERROR") {
          const message = err?.message ?? "Unknown channel error"
          console.error(`Promoters channel error (${status}):`, message)
            
            // Retry connection if we haven't exceeded max retries
            if (retryCount < maxRetries) {
              retryCount++
              console.log(`Retrying promoters subscription (${retryCount}/${maxRetries})...`)
              retryTimeout = setTimeout(() => {
                supabase.removeChannel(channel)
                isSubscribed = false
                setupSubscription()
              }, 2000 * retryCount) // Exponential backoff
            } else {
              console.error("Max retries exceeded for promoters subscription")
              // Don't show toast for realtime errors as they're not critical
            }
          }
          if (status === "TIMED_OUT") {
            console.warn(`Subscription timed out (${status})`)
            
            // Retry connection if we haven't exceeded max retries
            if (retryCount < maxRetries) {
              retryCount++
              console.log(`Retrying promoters subscription after timeout (${retryCount}/${maxRetries})...`)
              retryTimeout = setTimeout(() => {
                supabase.removeChannel(channel)
                isSubscribed = false
                setupSubscription()
              }, 2000 * retryCount) // Exponential backoff
            } else {
              console.error("Max retries exceeded for promoters subscription after timeout")
              // Don't show toast for realtime errors as they're not critical
            }
          }
        })

      return channel
    }

    const channel = setupSubscription()

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
      isSubscribed = false
      supabase.removeChannel(channel)
    }
  }, [queryClient, queryKey, enableRealtime])

  return { ...queryResult, errorMessage: queryResult.error?.message }
}
