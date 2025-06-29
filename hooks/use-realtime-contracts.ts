"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "@/lib/stores/contracts-store"
import type { Contract } from "@/lib/stores/contracts-store"

export function useRealtimeContracts() {
  const { updateContract, addContract } = useContractsStore()

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
            addContract(payload.new as Contract)
          } else if (payload.eventType === "UPDATE") {
            updateContract(payload.new.id, payload.new as Partial<Contract>)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [updateContract, addContract])
}
