import { promoterProfileSchema } from "../promoter-profile-schema"

describe("promoterProfileSchema", () => {
  it("should validate a correct promoter profile", () => {
    const validData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      company_name: "Acme Corp",
      company_address: "123 Main St",
      contact_person: "Jane Smith",
      contact_email: "jane.smith@example.com",
      contact_phone: "098-765-4321",
      website: "https://www.acmecorp.com",
      notes: "Some notes here.",
      logo_url: "https://example.com/logo.png",
    }
    const result = promoterProfileSchema.safeParse(validData)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(validData)
  })

  it("should allow optional fields to be null or undefined", () => {
    const validData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      company_name: "Acme Corp",
      company_address: "123 Main St",
      contact_person: null,
      contact_email: undefined,
      contact_phone: "",
      website: null,
      notes: undefined,
      logo_url: "",
    }
    const result = promoterProfileSchema.safeParse(validData)
    expect(result.success).toBe(true)
    expect(result.data).toEqual({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      company_name: "Acme Corp",
      company_address: "123 Main St",
      contact_person: null,
      contact_email: null, // Zod transforms undefined/empty string to null for nullable fields
      contact_phone: null,
      website: null,
      notes: null,
      logo_url: null,
    })
  })

  it("should fail validation for missing required fields", () => {
    const invalidData = {
      email: "john.doe@example.com",
      phone: "123-456-7890",
      company_name: "Acme Corp",
      company_address: "123 Main St",
    }
    const result = promoterProfileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "name")).toBe(true)
    }
  })

  it("should fail validation for invalid email format", () => {
    const invalidData = {
      name: "John Doe",
      email: "invalid-email",
      phone: "123-456-7890",
      company_name: "Acme Corp",
      company_address: "123 Main St",
    }
    const result = promoterProfileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "email")).toBe(true)
    }
  })

  it("should fail validation for invalid website URL", () => {
    const invalidData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      company_name: "Acme Corp",
      company_address: "123 Main St",
      website: "not-a-url",
    }
    const result = promoterProfileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "website")).toBe(true)
    }
  })
})
