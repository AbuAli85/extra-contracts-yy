"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteParty(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("parties").delete().eq("id", id)

  if (error) {
    console.error("Error deleting party:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/manage-parties")
  return { success: true, message: "Party deleted successfully." }
}
