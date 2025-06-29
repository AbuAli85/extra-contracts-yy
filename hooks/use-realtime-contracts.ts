"use client"

import { useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useContractsStore } from "@/lib/stores/contracts-store"
import type { Contract } from "@/lib/stores/contracts-store"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function useRealtimeContracts() {
  const { updateContract, fetchContracts } = useContractsStore()

  useEffect(() => {
    // Initial fetch
    fetchContracts()

    // Set up real-time subscription
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
            // Handle deletion if needed
            fetchContracts()
          }
        },
      )
      .subscribe((status) => {
        console.log("Subscription status:", status)
      })

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [updateContract, fetchContracts])
}
