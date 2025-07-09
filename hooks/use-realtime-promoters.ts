<<<<<<< HEAD
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
=======
import { useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRealtimeTable } from "./use-realtime-table"
import type { Promoter } from "@/lib/types"

export function useRealtimePromoters() {
  const [promoters, setPromoters] = useState<Promoter[]>([])

  const fetchPromoters = useCallback(async () => {
    const { data } = await supabase.from("promoters").select("*")
    setPromoters((data as any) || [])
  }, [])

  useRealtimeTable("promoters", fetchPromoters)

  useEffect(() => { fetchPromoters() }, [fetchPromoters])

  return promoters
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
}
