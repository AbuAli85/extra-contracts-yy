"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { toast } from "sonner"

export function useRealtimeContracts() {
  const { addContract, updateContract } = useContractsStore()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("contracts-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "contracts",
        },
        (payload) => {
          addContract(payload.new as any)
          toast.success("New contract created")
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "contracts",
        },
        (payload) => {
          updateContract(payload.new.id, payload.new as any)

          if (payload.new.status === "completed") {
            toast.success("Contract generation completed")
          } else if (payload.new.status === "failed") {
            toast.error("Contract generation failed")
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [addContract, updateContract])
}
