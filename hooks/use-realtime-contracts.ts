<<<<<<< HEAD
import { useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRealtimeTable } from "./use-realtime-table"

export function useRealtimeContracts() {
  const [contracts, setContracts] = useState([])

  const fetchContracts = useCallback(async () => {
    const { data } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })
    setContracts(data || [])
  }, [])

  useRealtimeTable("contracts", fetchContracts)

  // Initial fetch
  useEffect(() => { fetchContracts() }, [fetchContracts])

  return contracts
=======
import { useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRealtimeTable } from "./use-realtime-table"
import type { Contract } from "@/lib/types"

export function useRealtimeContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])

  const fetchContracts = useCallback(async () => {
    const { data } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })
    setContracts((data as any) || [])
  }, [])

  useRealtimeTable("contracts", fetchContracts)

  // Initial fetch
  useEffect(() => { fetchContracts() }, [fetchContracts])

  return contracts
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
}
