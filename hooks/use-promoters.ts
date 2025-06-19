import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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
    toast.error("Error loading promoters", { description: error.message })
    throw new Error(error.message)
  }
  return data || []
}

export const usePromoters = () => {
  const router = useRouter()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["promoters"], [])

  const queryResult = useQuery<Promoter[], Error>({
    queryKey,
    queryFn: fetchPromoters,
    staleTime: 1000 * 60 * 5,
    enabled: sessionChecked && hasSession,
  })

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSessionChecked(true)
      if (!session) {
        toast.error("Please login to continue")
        router.push("/login")
        setHasSession(false)
      } else {
        setHasSession(true)
      }
    }
    checkSession()

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
  }, [queryClient, router])

  return { ...queryResult, errorMessage: queryResult.error?.message }
}
