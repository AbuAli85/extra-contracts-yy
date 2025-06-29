import { z } from "zod"

export const partySchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  phone: z.string().min(1, "Phone number is required."),
  type: z.enum(["Client", "Vendor", "Other"], {
    required_error: "Party type is required.",
  }),
})
