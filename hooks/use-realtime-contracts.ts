"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { toast } from "sonner"

export function useRealtimeContracts() {
  const { fetchContracts } = useContractsStore()

  useEffect(() => {
    const supabase = createClient()

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
            toast.success("New contract created")
          } else if (payload.eventType === "UPDATE") {
            const newRecord = payload.new as any
            if (newRecord.status === "completed") {
              toast.success("Contract completed successfully")
            } else if (newRecord.status === "failed") {
              toast.error("Contract generation failed")
            }
          }

          // Refresh contracts list
          fetchContracts()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchContracts])
}
