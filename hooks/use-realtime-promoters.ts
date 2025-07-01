import { useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRealtimeTable } from "./use-realtime-table"

export function useRealtimePromoters() {
  const [promoters, setPromoters] = useState([])

  const fetchPromoters = useCallback(async () => {
    const { data } = await supabase.from("promoters").select("*")
    setPromoters(data || [])
  }, [])

  useRealtimeTable("promoters", fetchPromoters)

  useEffect(() => { fetchPromoters() }, [fetchPromoters])

  return promoters
} 