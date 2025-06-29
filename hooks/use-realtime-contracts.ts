"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore, type Contract } from "@/lib/stores/contracts-store"

export function useRealtimeContracts() {
  const { updateContract, fetchContracts } = useContractsStore()

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to real-time changes on the contracts table
    const channel = supabase
      .channel("contracts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contracts",
        },
        (payload) => {
          console.log("Real-time contract update:", payload)

          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            updateContract(payload.new as Contract)
          } else if (payload.eventType === "DELETE") {
            // Refetch all contracts if one is deleted
            fetchContracts()
          }
        },
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [updateContract, fetchContracts])
}
