import { z } from "zod"

export const generateContractFormSchema = z.object({
  contractName: z.string().min(1, "Contract name is required."),
  contractType: z.string().min(1, "Contract type is required."),
  partyA: z.string().min(1, "First party is required."),
  partyB: z.string().min(1, "Second party is required."),
  promoter: z.string().optional().nullable(),
  effectiveDate: z.date({
    required_error: "Effective date is required.",
    invalid_type_error: "Invalid date format for effective date.",
  }),
  terminationDate: z.date({
    required_error: "Termination date is required.",
    invalid_type_error: "Invalid date format for termination date.",
  }),
  contractValue: z.number().min(0, "Contract value must be a positive number.").optional().nullable(),
  paymentTerms: z.string().optional().nullable(),
  contentEnglish: z.string().min(1, "English content is required."),
  contentSpanish: z.string().min(1, "Spanish content is required."),
})
