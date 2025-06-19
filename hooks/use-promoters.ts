import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Promoter } from "@/types/custom"

const fetchPromoters = async (): Promise<Promoter[]> => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("Error fetching session:", sessionError)
    throw new Error(sessionError.message)
  }

  if (!session) {
    throw new Error("Not authenticated")
  }

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
  const router = useRouter()

  const queryResult = useQuery<Promoter[], Error>({
    queryKey,
    queryFn: fetchPromoters,
    staleTime: 1000 * 60 * 5,
    retry: false,
    onError: (error) => {
      if (error.message === "Not authenticated") {
        toast({
          title: "Authentication Required",
          description: error.message,
          variant: "destructive",
        })
        router.push("/login")
      } else {
        toast({
          title: "Error loading promoters",
          description: error.message,
          variant: "destructive",
        })
      }
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
      // Supabase v2 subscribe callback only receives the status
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Promoters channel error:", channel.getError())
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, queryKey])

  return { ...queryResult, errorMessage: queryResult.error?.message }
}
