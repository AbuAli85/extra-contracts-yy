"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore, type Contract } from "@/lib/stores/contracts-store"

export function useRealtimeContracts() {
  const { updateContract, addContract } = useContractsStore()

  useEffect(() => {
    const supabase = createClient()

    const subscription = supabase
      .channel("contracts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contracts",
        },
        (payload) => {
          console.log("Real-time update:", payload)

          if (payload.eventType === "INSERT") {
            addContract(payload.new as Contract)
          } else if (payload.eventType === "UPDATE") {
            updateContract(payload.new as Contract)
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [updateContract, addContract])
}
