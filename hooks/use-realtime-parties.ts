<<<<<<< HEAD
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
=======
import { useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRealtimeTable } from "./use-realtime-table"
import type { Party } from "@/lib/types"

export function useRealtimeParties() {
  const [parties, setParties] = useState<Party[]>([])

  const fetchParties = useCallback(async () => {
    const { data } = await supabase.from("parties").select("*")
    setParties(data || [])
  }, [])

  useRealtimeTable("parties", fetchParties)

  useEffect(() => { fetchParties() }, [fetchParties])

  return parties
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
}
