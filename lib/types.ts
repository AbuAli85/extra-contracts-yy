import type { Database } from "@/types/supabase"

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

export type Contract = Tables<"contracts"> & {
  parties_a?: Party | null
  parties_b?: Party | null
  promoters?: Promoter | null
}

export type Party = Tables<"parties">
export type Promoter = Tables<"promoters">
