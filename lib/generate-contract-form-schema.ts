import { z } from "zod"

export const contractFormSchema = z.object({
  first_party_id: z.string().min(1, "First party is required."),
  second_party_id: z.string().min(1, "Second party is required."),
  promoter_id: z.string().min(1, "Promoter is required."),
  contract_start_date: z.date({
    required_error: "Contract start date is required.",
    invalid_type_error: "Invalid date format for start date.",
  }),
  contract_end_date: z.date({
    required_error: "Contract end date is required.",
    invalid_type_error: "Invalid date format for end date.",
  }),
  job_title: z.string().min(1, "Job title is required."),
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  work_location: z.string().min(1, "Work location is required."),
})
