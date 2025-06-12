import { z } from "zod"

export const contractGeneratorSchema = z
  .object({
    first_party_id: z.string().uuid("Please select the first party."),
    second_party_id: z.string().uuid("Please select the second party."),
    promoter_id: z.string().uuid("Please select the promoter."),
    contract_start_date: z.date({ required_error: "Contract start date is required." }),
    contract_end_date: z.date({ required_error: "Contract end date is required." }),
    email: z.string().email("Please enter a valid email address for notifications.").min(1, "Email is required."),
  })
  .refine((data) => data.contract_end_date >= data.contract_start_date, {
    message: "Contract end date must be on or after the start date.",
    path: ["contract_end_date"],
  })
  .refine((data) => data.first_party_id !== data.second_party_id, {
    message: "First and Second Party cannot be the same.",
    path: ["second_party_id"],
  })

export type ContractGeneratorFormData = z.infer<typeof contractGeneratorSchema>
