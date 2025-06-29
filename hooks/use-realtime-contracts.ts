"use client"

import { useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useContractsStore, type Contract } from "@/lib/stores/contracts-store"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function useRealtimeContracts() {
  const updateContract = useContractsStore((state) => state.updateContract)

  useEffect(() => {
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
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            updateContract(payload.new as Contract)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [updateContract])
}
