"use client"

import { useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useContractsStore } from "@/lib/stores/contracts-store"
import type { Contract } from "@/lib/stores/contracts-store"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function useRealtimeContracts() {
  const { updateContract, addContract } = useContractsStore()

  useEffect(() => {
    const channel = supabase
      .channel("contracts-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "contracts",
        },
        (payload) => {
          console.log("Contract updated:", payload.new)
          updateContract(payload.new as Contract)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "contracts",
        },
        (payload) => {
          console.log("Contract inserted:", payload.new)
          addContract(payload.new as Contract)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [updateContract, addContract])

  return null
}
