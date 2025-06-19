import { z } from "zod"

export const formSchema = z
  .object({
    promoterId: z.string().uuid(),
    firstPartyId: z.string().uuid(),
    secondPartyId: z.string().uuid(),
    startDate: z.date(),
    endDate: z.date(),
    refNumber: z.string(),
    jobTitle: z.string().optional(),
    workLocation: z.string().optional(),
    email: z.string().email(),
  })
  .refine((d) => d.endDate > d.startDate, {
    path: ["endDate"],
    message: "End date must be after start date",
  })
