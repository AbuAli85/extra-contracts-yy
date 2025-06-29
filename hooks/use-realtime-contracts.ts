"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "@/lib/stores/contracts-store"
import type { Contract } from "@/lib/stores/contracts-store"

export function useRealtimeContracts(userId?: string) {
  const { setContracts, addContract, updateContract } = useContractsStore()

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    // Initial fetch
    const fetchContracts = async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching contracts:", error)
        return
      }

      setContracts(data || [])
    }

    fetchContracts()

    // Set up real-time subscription
    const channel = supabase
      .channel("contracts-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "contracts",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          addContract(payload.new as Contract)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "contracts",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          updateContract(payload.new.id, payload.new as Partial<Contract>)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, setContracts, addContract, updateContract])
}
