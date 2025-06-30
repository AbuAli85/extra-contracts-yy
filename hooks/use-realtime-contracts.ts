"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { toast } from "sonner"
import { logError, withRetry } from "@/lib/error-handler"

export function useRealtimeContracts() {
  const { fetchContracts } = useContractsStore()
  const channelRef = useRef<ReturnType<typeof createClient>["channel"] | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const setupRealtimeSubscription = () => {
      try {
        // Clean up any existing channel
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current)
        }

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

              try {
                if (payload.eventType === "INSERT") {
                  toast.success("New contract created")
                } else if (payload.eventType === "UPDATE") {
                  const newRecord = payload.new as any
                  if (newRecord.status === "completed") {
                    toast.success("Contract completed successfully")
                  } else if (newRecord.status === "failed") {
                    toast.error("Contract generation failed")
                  } else if (newRecord.status === "generating") {
                    toast.info("Contract generation in progress")
                  }
                } else if (payload.eventType === "DELETE") {
                  toast.info("Contract removed")
                }

                // Refresh contracts list with retry logic
                withRetry(() => fetchContracts(), 3, 1000).catch((error) => {
                  logError(error, { context: "realtime-fetch-contracts" })
                  toast.error("Failed to refresh contracts list")
                })
              } catch (error) {
                logError(error, { context: "realtime-payload-processing", payload })
                toast.error("Failed to process contract update")
              }
            },
          )
          .subscribe((status) => {
            console.log("Realtime subscription status:", status)
            
            if (status === "SUBSCRIBED") {
              toast.success("Real-time updates connected")
            } else if (status === "CHANNEL_ERROR") {
              logError(new Error("Realtime channel error"), { status })
              toast.error("Real-time connection error")
              
              // Attempt to reconnect after a delay
              if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
              }
              reconnectTimeoutRef.current = setTimeout(() => {
                console.log("Attempting to reconnect real-time subscription")
                setupRealtimeSubscription()
              }, 5000)
            } else if (status === "TIMED_OUT") {
              logError(new Error("Realtime subscription timed out"), { status })
              toast.warning("Real-time connection timed out, attempting to reconnect")
              setupRealtimeSubscription()
            } else if (status === "CLOSED") {
              console.log("Realtime subscription closed")
            }
          })

        channelRef.current = channel
      } catch (error) {
        logError(error, { context: "setup-realtime-subscription" })
        toast.error("Failed to setup real-time updates")
      }
    }

    // Initial setup
    setupRealtimeSubscription()

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }
  }, [fetchContracts])

  // Return a function to manually reconnect if needed
  return {
    reconnect: () => {
      const supabase = createClient()
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      // The useEffect will handle reconnection
    }
  }
}
