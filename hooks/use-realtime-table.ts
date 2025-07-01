import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useRealtimeTable(table: string, onChange: (payload: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel(`public:${table}:realtime`)
      .on("postgres_changes", { event: "*", schema: "public", table }, onChange)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, onChange])
} 