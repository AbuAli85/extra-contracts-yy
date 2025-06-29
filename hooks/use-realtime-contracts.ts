"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "@/lib/stores/contracts-store"

export function useRealtimeContracts() {
  const { updateContract, fetchContracts } = useContractsStore()

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to contract changes
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
          console.log("Contract change received:", payload)

          if (payload.eventType === "INSERT") {
            // Refresh all contracts when a new one is inserted
            fetchContracts()
          } else if (payload.eventType === "UPDATE") {
            // Update specific contract
            const updatedContract = payload.new as any
            updateContract(updatedContract.id, updatedContract)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [updateContract, fetchContracts])
}
