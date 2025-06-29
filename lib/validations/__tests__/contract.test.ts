import { contractSchema } from "../contract"

describe("contractSchema", () => {
  it("should validate a correct contract", () => {
    const validData = {
      contract_name: "Service Agreement",
      contract_type: "Service",
      party_a_id: "uuid-party-a",
      party_b_id: "uuid-party-b",
      promoter_id: "uuid-promoter",
      start_date: new Date("2023-01-01"),
      end_date: new Date("2023-12-31"),
      contract_value: "10000.00",
      content_english: "This is the English content.",
      content_spanish: "Este es el contenido en español.",
      status: "Draft",
    }
    const result = contractSchema.safeParse(validData)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(validData)
  })

  it("should allow optional fields to be undefined", () => {
    const validData = {
      contract_name: "Service Agreement",
      contract_type: "Service",
      party_a_id: "uuid-party-a",
      party_b_id: "uuid-party-b",
      promoter_id: "uuid-promoter",
      start_date: undefined,
      end_date: undefined,
      contract_value: "10000.00",
      content_english: "This is the English content.",
      content_spanish: "Este es el contenido en español.",
      status: "Draft",
    }
    const result = contractSchema.safeParse(validData)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(validData)
  })

  it("should fail validation for missing required fields", () => {
    const invalidData = {
      contract_type: "Service",
      party_a_id: "uuid-party-a",
      party_b_id: "uuid-party-b",
      promoter_id: "uuid-promoter",
      start_date: new Date("2023-01-01"),
      end_date: new Date("2023-12-31"),
      contract_value: "10000.00",
      content_english: "This is the English content.",
      content_spanish: "Este es el contenido en español.",
      status: "Draft",
    }
    const result = contractSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "contract_name")).toBe(true)
    }
  })

  it("should fail validation for invalid contract_value (not a number)", () => {
    const invalidData = {
      contract_name: "Service Agreement",
      contract_type: "Service",
      party_a_id: "uuid-party-a",
      party_b_id: "uuid-party-b",
      promoter_id: "uuid-promoter",
      start_date: new Date("2023-01-01"),
      end_date: new Date("2023-12-31"),
      contract_value: "not-a-number",
      content_english: "This is the English content.",
      content_spanish: "Este es el contenido en español.",
      status: "Draft",
    }
    const result = contractSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "contract_value")).toBe(true)
    }
  })

  it("should fail validation if end_date is before start_date", () => {
    const invalidData = {
      contract_name: "Service Agreement",
      contract_type: "Service",
      party_a_id: "uuid-party-a",
      party_b_id: "uuid-party-b",
      promoter_id: "uuid-promoter",
      start_date: new Date("2023-12-31"),
      end_date: new Date("2023-01-01"),
      contract_value: "10000.00",
      content_english: "This is the English content.",
      content_spanish: "Este es el contenido en español.",
      status: "Draft",
    }
    const result = contractSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === "End date cannot be before start date.")).toBe(true)
    }
  })
})
