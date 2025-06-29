"use client"

import { useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useContractsStore } from "@/lib/stores/contracts-store"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function useRealtimeContracts() {
  const { addContract, updateContract, removeContract } = useContractsStore()

  useEffect(() => {
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
          updateContract(payload.new as any)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "contracts",
        },
        (payload) => {
          removeContract(payload.old.id)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [addContract, updateContract, removeContract])
}
