"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "@/lib/stores/contracts-store"
import type { Database } from "@/types/supabase"

type Contract = Database["public"]["Tables"]["contracts"]["Row"]

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
          console.log("Real-time contract update:", payload)

          if (payload.eventType === "INSERT") {
            const newContract = payload.new as Contract
            addContract({
              id: newContract.id,
              contract_number: newContract.contract_number,
              party_a: newContract.party_a,
              party_b: newContract.party_b,
              contract_type: newContract.contract_type,
              description: newContract.description,
              status: newContract.status as "pending" | "queued" | "processing" | "completed" | "failed",
              pdf_url: newContract.pdf_url,
              created_at: newContract.created_at,
              updated_at: newContract.updated_at,
              user_id: newContract.user_id,
            })
          } else if (payload.eventType === "UPDATE") {
            const updatedContract = payload.new as Contract
            updateContract(updatedContract.id, {
              status: updatedContract.status as "pending" | "queued" | "processing" | "completed" | "failed",
              pdf_url: updatedContract.pdf_url,
              updated_at: updatedContract.updated_at,
            })
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [updateContract, addContract])
}
