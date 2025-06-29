import { contractSchema } from "../contract"

describe("contractSchema", () => {
  const baseValidContract = {
    contract_name: "Test Contract",
    contract_type: "Service",
    status: "Draft",
    party_a_id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    party_b_id: "f6e5d4c3-b2a1-0987-6543-210fedcba987",
    promoter_id: "1a2b3c4d-5e6f-7890-abcd-ef1234567890",
    effective_date: "2023-01-01",
    termination_date: "2024-01-01",
    contract_value: 1000.5,
    payment_terms: "Net 30",
    content_english: "This is the English content.",
    content_spanish: "Este es el contenido en español.",
    is_template: false,
    is_archived: false,
  }

  it("should validate a correct contract", () => {
    const result = contractSchema.safeParse(baseValidContract)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(baseValidContract)
  })

  it("should allow optional fields to be missing or empty", () => {
    const partialContract = {
      contract_name: "Partial Contract",
      contract_type: "Sales",
      status: "Active",
      party_a_id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      party_b_id: "f6e5d4c3-b2a1-0987-6543-210fedcba987",
      content_english: "English content.",
      content_spanish: "Spanish content.",
      // Missing promoter_id, dates, value, terms, and booleans
    }
    const result = contractSchema.safeParse(partialContract)
    expect(result.success).toBe(true)
    expect(result.data).toEqual({
      ...partialContract,
      promoter_id: undefined,
      effective_date: undefined,
      termination_date: undefined,
      contract_value: undefined,
      payment_terms: "",
      is_template: false,
      is_archived: false,
    })
  })

  it("should trim string fields", () => {
    const contractWithWhitespace = {
      ...baseValidContract,
      contract_name: "  Contract With Spaces  ",
      payment_terms: "  Trimmed Terms  ",
    }
    const result = contractSchema.safeParse(contractWithWhitespace)
    expect(result.success).toBe(true)
    expect(result.data?.contract_name).toBe("Contract With Spaces")
    expect(result.data?.payment_terms).toBe("Trimmed Terms")
  })

  it("should fail validation for missing required fields", () => {
    const missingName = { ...baseValidContract, contract_name: "" }
    let result = contractSchema.safeParse(missingName)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "contract_name")).toBe(true)

    const missingType = { ...baseValidContract, contract_type: "" }
    result = contractSchema.safeParse(missingType)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "contract_type")).toBe(true)

    const missingPartyA = { ...baseValidContract, party_a_id: "" }
    result = contractSchema.safeParse(missingPartyA)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "party_a_id")).toBe(true)

    const missingContentEnglish = { ...baseValidContract, content_english: "" }
    result = contractSchema.safeParse(missingContentEnglish)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "content_english")).toBe(true)
  })

  it("should fail validation for invalid UUIDs", () => {
    const invalidPartyA = { ...baseValidContract, party_a_id: "not-a-uuid" }
    let result = contractSchema.safeParse(invalidPartyA)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "party_a_id")).toBe(true)

    const invalidPromoter = { ...baseValidContract, promoter_id: "another-invalid-uuid" }
    result = contractSchema.safeParse(invalidPromoter)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "promoter_id")).toBe(true)
  })

  it("should handle contract_value as a number", () => {
    const stringValue = { ...baseValidContract, contract_value: "1234.56" }
    let result = contractSchema.safeParse(stringValue)
    expect(result.success).toBe(true)
    expect(result.data?.contract_value).toBe(1234.56)

    const invalidNumber = { ...baseValidContract, contract_value: "abc" }
    result = contractSchema.safeParse(invalidNumber)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "contract_value")).toBe(true)
  })

  it("should validate date formats", () => {
    const invalidEffectiveDate = { ...baseValidContract, effective_date: "not-a-date" }
    let result = contractSchema.safeParse(invalidEffectiveDate)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "effective_date")).toBe(true)

    const invalidTerminationDate = { ...baseValidContract, termination_date: "invalid-date" }
    result = contractSchema.safeParse(invalidTerminationDate)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "termination_date")).toBe(true)
  })

  it("should ensure termination_date is after effective_date if both are present", () => {
    const invalidDateRange = {
      ...baseValidContract,
      effective_date: "2024-01-01",
      termination_date: "2023-01-01",
    }
    const result = contractSchema.safeParse(invalidDateRange)
    expect(result.success).toBe(false)
    expect(result.error?.errors[0]?.message).toContain("Termination date cannot be before effective date")

    const validDateRange = {
      ...baseValidContract,
      effective_date: "2023-01-01",
      termination_date: "2024-01-01",
    }
    const result2 = contractSchema.safeParse(validDateRange)
    expect(result2.success).toBe(true)
  })

  it("should handle boolean fields correctly", () => {
    const booleanTest = {
      ...baseValidContract,
      is_template: true,
      is_archived: true,
    }
    const result = contractSchema.safeParse(booleanTest)
    expect(result.success).toBe(true)
    expect(result.data?.is_template).toBe(true)
    expect(result.data?.is_archived).toBe(true)
  })
})
