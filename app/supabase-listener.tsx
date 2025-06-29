"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "./stores/contractsStore"

export default function SupabaseListener() {
  const router = useRouter()
  const supabase = createClient()
  const { updateContract } = useContractsStore()

  useEffect(() => {
    // Auth state changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.refresh()
      }
      if (event === "SIGNED_OUT") {
        router.push("/login")
      }
    })

    // Real-time contract updates
    const contractsSubscription = supabase
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

          if (payload.eventType === "UPDATE" && payload.new) {
            updateContract(payload.new as any)
          }
        },
      )
      .subscribe()

    return () => {
      authSubscription.unsubscribe()
      contractsSubscription.unsubscribe()
    }
  }, [router, supabase.auth, updateContract])

  return null
}

// Also export as named export for compatibility
export { SupabaseListener }
