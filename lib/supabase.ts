import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or Anon Key is missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.x',
    },
  },
})

// Utility function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session?.user
  } catch (error) {
    console.error("Error checking authentication status:", error)
    return false
  }
}

// Utility function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error("Error getting current user:", error)
      return null
    }
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Utility function to handle realtime connection errors
export const handleRealtimeError = (error: any, tableName: string) => {
  const message = error?.message ?? "Unknown channel error"
  
  // Check for specific error types
  if (message.includes("JWT") || message.includes("auth") || message.includes("permission")) {
    console.warn(`Authentication error for ${tableName}:`, message)
    return "AUTH_ERROR"
  }
  
  if (message.includes("timeout") || message.includes("TIMED_OUT")) {
    console.warn(`Timeout error for ${tableName}:`, message)
    return "TIMEOUT_ERROR"
  }
  
  if (message.includes("network") || message.includes("connection")) {
    console.warn(`Network error for ${tableName}:`, message)
    return "NETWORK_ERROR"
  }
  
  console.error(`Unknown error for ${tableName}:`, message)
  return "UNKNOWN_ERROR"
}

// Utility function to safely create a realtime channel
export const createRealtimeChannel = (tableName: string, callback: (payload: any) => void) => {
  try {
    return supabase
      .channel(`public-${tableName}-realtime`)
      .on("postgres_changes", { event: "*", schema: "public", table: tableName }, callback)
  } catch (error) {
    console.error(`Error creating realtime channel for ${tableName}:`, error)
    return null
  }
}

// Utility function to safely subscribe to a channel
export const subscribeToChannel = (channel: any, onStatusChange?: (status: string, error?: any) => void) => {
  if (!channel) return null
  
  try {
    return channel.subscribe((status: string, error?: any) => {
      if (onStatusChange) {
        onStatusChange(status, error)
      }
    })
  } catch (error) {
    console.error("Error subscribing to channel:", error)
    return null
  }
}
