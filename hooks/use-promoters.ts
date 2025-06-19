import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import { toast } from "sonner"
import { useToast } from "@/hooks/use-toast"
import type { Promoter } from "@/types/custom"

const fetchPromoters = async (): Promise<Promoter[]> => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Authentication Required")
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
  const router = useRouter()
  const { toast: toastify } = useToast()
  const queryKey = useMemo(() => ["promoters"], [])

  const queryResult = useQuery<Promoter[], Error>({
    queryKey,
    queryFn: fetchPromoters,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      if (error.message === "Authentication Required") {
        toastify({ title: "Authentication Required" })
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
