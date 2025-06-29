import { z } from "zod"

export const contractSchema = z
  .object({
    contract_name: z.string().min(1, "Contract name is required."),
    contract_type: z.string().min(1, "Contract type is required."),
    party_a_id: z.string().min(1, "Party A is required."),
    party_b_id: z.string().min(1, "Party B is required."),
    promoter_id: z.string().min(1, "Promoter is required."),
    start_date: z.date().optional().nullable(),
    end_date: z.date().optional().nullable(),
    contract_value: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0, "Contract value must be a positive number.").optional().nullable(),
    ),
    content_english: z.string().min(1, "English content is required."),
    content_spanish: z.string().min(1, "Spanish content is required."),
    status: z.enum(["Draft", "Pending Review", "Approved", "Signed", "Active", "Completed", "Archived"], {
      required_error: "Status is required.",
    }),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.end_date >= data.start_date
      }
      return true
    },
    {
      message: "End date cannot be before start date.",
      path: ["end_date"],
    },
  )
