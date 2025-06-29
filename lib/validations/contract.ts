import { z } from "zod"

export const contractSchema = z
  .object({
    contract_name: z.string().min(1, "Contract name is required").trim(),
    contract_type: z.string().min(1, "Contract type is required").trim(),
    status: z.string().min(1, "Status is required").trim(),
    party_a_id: z.string().uuid("Invalid Party A ID").min(1, "Party A is required"),
    party_b_id: z.string().uuid("Invalid Party B ID").min(1, "Party B is required"),
    promoter_id: z.string().uuid("Invalid Promoter ID").optional().or(z.literal("")), // Allow empty string for optional
    effective_date: z.preprocess(
      (arg) => (typeof arg === "string" && arg === "" ? undefined : arg),
      z.coerce.date().optional(),
    ),
    termination_date: z.preprocess(
      (arg) => (typeof arg === "string" && arg === "" ? undefined : arg),
      z.coerce.date().optional(),
    ),
    contract_value: z.preprocess(
      (arg) => (typeof arg === "string" && arg === "" ? undefined : Number.parseFloat(arg as string)),
      z.number().positive("Contract value must be a positive number").optional(),
    ),
    payment_terms: z
      .string()
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
    content_english: z.string().min(1, "English content is required").trim(),
    content_spanish: z.string().min(1, "Spanish content is required").trim(),
    is_template: z.boolean().default(false),
    is_archived: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.effective_date && data.termination_date && data.termination_date < data.effective_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Termination date cannot be before effective date",
        path: ["termination_date"],
      })
    }
  })

export type ContractFormValues = z.infer<typeof contractSchema>
