import { useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRealtimeTable } from "./use-realtime-table"

export function useRealtimeParties() {
  const [parties, setParties] = useState([])

  const fetchParties = useCallback(async () => {
    const { data } = await supabase.from("parties").select("*")
    setParties(data || [])
  }, [])

  useRealtimeTable("parties", fetchParties)

  useEffect(() => { fetchParties() }, [fetchParties])

  return parties
} 