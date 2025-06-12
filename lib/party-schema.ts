import { z } from "zod"

export const partyFormSchema = z.object({
  name_en: z.string().min(1, "Party name (English) is required"),
  name_ar: z.string().min(1, "Party name (Arabic) is required"),
  crn: z.string().min(1, "Commercial Registration Number (CRN) is required"),
})

export type PartyFormData = z.infer<typeof partyFormSchema>
