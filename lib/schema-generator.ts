import { z } from "zod"

// Enhanced contract generator schema with comprehensive validation
export const contractGeneratorSchema = z
  .object({
    // Required party IDs
    first_party_id: z.string().uuid("Please select Party A (Client)."),
    second_party_id: z.string().uuid("Please select Party B (Employer)."),
    promoter_id: z.string().uuid("Please select the promoter."),

    // Auto-filled party data (hidden fields)
    first_party_name_en: z.string().optional(),
    first_party_name_ar: z.string().optional(),
    first_party_crn: z.string().optional(),
    second_party_name_en: z.string().optional(),
    second_party_name_ar: z.string().optional(),
    second_party_crn: z.string().optional(),

    // Auto-filled promoter data (hidden fields)
    promoter_name_en: z.string().optional(),
    promoter_name_ar: z.string().optional(),
    id_card_number: z.string().optional(),
    promoter_id_card_url: z.string().optional(),
    promoter_passport_url: z.string().optional(),

    // Contract period with enhanced validation
    contract_start_date: z.date({
      required_error: "Contract start date is required.",
      invalid_type_error: "Please enter a valid start date.",
    }),
    contract_end_date: z.date({
      required_error: "Contract end date is required.",
      invalid_type_error: "Please enter a valid end date.",
    }),

    // Contact information
    email: z
      .string()
      .email("Please enter a valid email address for notifications.")
      .min(1, "Email is required for contract notifications.")
      .max(255, "Email address is too long."),

    // Required employment details
    job_title: z
      .string()
      .min(1, "Job title is required.")
      .max(100, "Job title is too long."),

    department: z
      .string()
      .min(1, "Department is required.")
      .max(100, "Department name is too long."),

    contract_type: z
      .string()
      .min(1, "Contract type is required.")
      .max(100, "Contract type is too long.")
      .refine(
        (value) => {
          // Validate against known contract types
          const validTypes = [
            "unlimited-contract",
            "limited-contract",
            "part-time-contract",
            "full-time-permanent",
            "full-time-fixed",
            "part-time-permanent",
            "part-time-fixed",
            "probationary",
            "training-contract",
            "internship",
            "graduate-trainee",
            "project-based",
            "consulting",
            "freelance",
            "contractor",
            "seasonal",
            "temporary",
            "casual",
            "executive",
            "management",
            "director",
            "remote-work",
            "hybrid-work",
            "secondment",
            "apprenticeship",
            "service-agreement",
            "retainer",
            "other",
          ]
          return validTypes.includes(value)
        },
        {
          message:
            "Please select a valid contract type from the available options.",
        }
      ),

    currency: z
      .string()
      .min(1, "Currency is required.")
      .max(10, "Currency code is too long."),

    work_location: z
      .string()
      .min(1, "Work location is required.")
      .max(200, "Work location is too long."),

    // Optional salary information (if provided, must be valid)
    basic_salary: z
      .number()
      .positive("Basic salary must be positive.")
      .max(1000000, "Basic salary seems to be unrealistically high.")
      .optional(),
    housing_allowance: z
      .number()
      .positive("Housing allowance must be positive.")
      .max(500000, "Housing allowance seems too high.")
      .optional(),
    transport_allowance: z
      .number()
      .positive("Transport allowance must be positive.")
      .max(500000, "Transport allowance seems too high.")
      .optional(),
    other_allowances: z
      .number()
      .positive("Other allowances must be positive.")
      .max(500000, "Other allowances seem too high.")
      .optional(),

    // Commission and bonus structure
    commission_percentage: z
      .number()
      .min(0, "Commission percentage cannot be negative.")
      .max(100, "Commission percentage cannot exceed 100%")
      .optional(),
    performance_bonus: z
      .number()
      .positive("Performance bonus must be positive.")
      .max(1000000, "Performance bonus seems to be unrealistically high.")
      .optional(),

    // Confidentiality and non-compete clauses
    nda_signed: z.boolean().optional(),
    non_compete_signed: z.boolean().optional(),

    // Document upload URLs
    contract_document_url: z.string().url("Invalid URL format for contract document."),
    annexures_urls: z.array(z.string().url("Invalid URL format for annexure.")).optional(),

    // Payment details
    bank_name: z.string().optional(),
    account_number: z.string().optional(),
    iban: z.string().optional(),
    swift_code: z.string().optional(),

    // Review and approval status
    reviewed_by: z.string().optional(),
    approved_by: z.string().optional(),
    status: z
      .string()
      .min(1, "Status is required.")
      .max(50, "Status description is too long."),

    // Timestamps
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
  })
  .refine(
    (data) => {
      // Type guard for dates
      return (
        data.contract_start_date instanceof Date &&
        data.contract_end_date instanceof Date &&
        data.contract_start_date < data.contract_end_date
      )
    },
    {
      message: "Contract end date must be after the start date.",
      path: ["contract_end_date"],
    }
  )
  .refine(
    (data) => {
      // Ensure at least one form of ID is provided for the promoter
      const idCardUrl = typeof data.promoter_id_card_url === "string" ? data.promoter_id_card_url : ""
      const passportUrl = typeof data.promoter_passport_url === "string" ? data.promoter_passport_url : ""
      return idCardUrl.length > 0 || passportUrl.length > 0
    },
    {
      message: "Please provide at least one form of ID for the promoter.",
      path: ["promoter_id_card_url", "promoter_passport_url"],
    }
  )
  .refine(
    (data) => {
      // Validate email domain if provided
      if (typeof data.email === "string" && data.email.includes("@")) {
        const domain = data.email.split("@")[1]
        return domain === "example.com" // Replace with your domain logic
      }
      return true
    },
    {
      message: "Email domain is not allowed.",
      path: ["email"],
    }
  )

// Example contract form sections (update as needed for your form)
export const CONTRACT_FORM_SECTIONS = [
  {
    title: "Parties",
    fields: ["first_party_id", "second_party_id", "promoter_id"],
    required: true,
  },
  {
    title: "Job Details",
    fields: ["job_title", "department", "contract_type", "work_location"],
    required: true,
  },
  {
    title: "Compensation",
    fields: ["basic_salary", "currency"],
    required: false,
  },
  // Add more sections as needed
]

// Returns all required fields from CONTRACT_FORM_SECTIONS
export function getRequiredFields() {
  return CONTRACT_FORM_SECTIONS.filter((section) => section.required).flatMap((section) => section.fields)
}
