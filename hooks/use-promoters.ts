import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import { toast } from "sonner"
import type { Promoter } from "@/types/custom"

const fetchPromoters = async (): Promise<Promoter[]> => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (!session || sessionError) {
    throw new Error("Authentication required to fetch promoters")
  }

  const { data, error } = await supabase
    .from("promoters")
    .select("*")
    .order("name_en", { ascending: true })

  if (error) {
    console.error("Error fetching promoters:", error)
    // Log the complete error object for easier debugging
    console.error(error)
    toast.error("Error loading promoters", { description: error.message })
    throw new Error(error.message)
  }
  return data || []
}

export const usePromoters = () => {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["promoters"], [])
  const router = useRouter()
  const { toast: toastHook } = useToast()

  const queryResult = useQuery<Promoter[], Error>({
    queryKey,
    queryFn: fetchPromoters,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      if (error.message === "Authentication required to fetch promoters") {
        toastHook({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        })
        router.push("/login")
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
