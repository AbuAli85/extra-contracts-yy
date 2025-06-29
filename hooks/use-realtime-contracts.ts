"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { toast } from "sonner"

export function useRealtimeContracts() {
  const { updateContract, addContract } = useContractsStore()

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
          if (payload.eventType === "INSERT") {
            addContract(payload.new as any)
            toast.success("New contract created!")
          } else if (payload.eventType === "UPDATE") {
            updateContract(payload.new.id, payload.new as any)

            // Show status-specific notifications
            if (payload.new.status === "completed") {
              toast.success(`Contract ${payload.new.contract_number} completed!`)
            } else if (payload.new.status === "failed") {
              toast.error(`Contract ${payload.new.contract_number} failed!`)
            }
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [updateContract, addContract])
}
