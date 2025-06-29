import { z } from "zod"

export const partySchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").min(1, "Email is required").trim(),
  phone: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  address: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  type: z.enum(["Individual", "Company"], {
    required_error: "Party type is required",
  }),
})

export type PartyFormValues = z.infer<typeof partySchema>
