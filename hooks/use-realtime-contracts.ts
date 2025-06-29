"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "@/lib/stores/contracts-store"

export function useRealtimeContracts() {
  const { updateContract, addContract } = useContractsStore()

  useEffect(() => {
    const supabase = createClient()

    const subscription = supabase
      .channel("contracts-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contracts",
        },
        (payload) => {
          console.log("Real-time contract update:", payload)

          switch (payload.eventType) {
            case "INSERT":
              if (payload.new) {
                addContract(payload.new as any)
              }
              break
            case "UPDATE":
              if (payload.new) {
                updateContract(payload.new as any)
              }
              break
            case "DELETE":
              // Handle deletion if needed
              break
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [updateContract, addContract])
}
