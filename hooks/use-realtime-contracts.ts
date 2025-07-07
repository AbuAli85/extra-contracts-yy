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
}
