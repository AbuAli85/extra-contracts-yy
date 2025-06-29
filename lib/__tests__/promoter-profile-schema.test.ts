import { promoterProfileSchema } from "../promoter-profile-schema"

describe("promoterProfileSchema", () => {
  it("should validate a correct promoter profile", () => {
    const validProfile = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      company: "Acme Corp",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip_code: "90210",
      country: "USA",
      bio: "Experienced promoter in the music industry.",
      website: "https://www.acmecorp.com",
      profile_picture_url: "https://example.com/profile.jpg",
    }
    const result = promoterProfileSchema.safeParse(validProfile)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(validProfile)
  })

  it("should allow optional fields to be missing", () => {
    const partialProfile = {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      company: "Smith & Co.",
    }
    const result = promoterProfileSchema.safeParse(partialProfile)
    expect(result.success).toBe(true)
    expect(result.data).toEqual({
      ...partialProfile,
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      bio: "",
      website: "",
      profile_picture_url: null,
    })
  })

  it("should trim string fields", () => {
    const profileWithWhitespace = {
      name: "  Trimmed Name  ",
      email: "  email@example.com  ",
      phone: "123",
      company: "Company",
    }
    const result = promoterProfileSchema.safeParse(profileWithWhitespace)
    expect(result.success).toBe(true)
    expect(result.data?.name).toBe("Trimmed Name")
    expect(result.data?.email).toBe("email@example.com")
  })

  it("should fail validation for invalid email", () => {
    const invalidEmailProfile = {
      name: "John Doe",
      email: "invalid-email",
      company: "Acme Corp",
    }
    const result = promoterProfileSchema.safeParse(invalidEmailProfile)
    expect(result.success).toBe(false)
    expect(result.error?.errors[0]?.path).toEqual(["email"])
  })

  it("should fail validation for missing required fields", () => {
    const missingName = {
      email: "test@example.com",
      company: "Test Co",
    }
    const result = promoterProfileSchema.safeParse(missingName)
    expect(result.success).toBe(false)
    expect(result.error?.errors.some((err) => err.path[0] === "name")).toBe(true)

    const missingEmail = {
      name: "Test Name",
      company: "Test Co",
    }
    const result2 = promoterProfileSchema.safeParse(missingEmail)
    expect(result2.success).toBe(false)
    expect(result2.error?.errors.some((err) => err.path[0] === "email")).toBe(true)

    const missingCompany = {
      name: "Test Name",
      email: "test@example.com",
    }
    const result3 = promoterProfileSchema.safeParse(missingCompany)
    expect(result3.success).toBe(false)
    expect(result3.error?.errors.some((err) => err.path[0] === "company")).toBe(true)
  })

  it("should handle empty strings for optional fields correctly", () => {
    const emptyOptionalFields = {
      name: "Test",
      email: "test@test.com",
      company: "TestCo",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      bio: "",
      website: "",
      profile_picture_url: "",
    }
    const result = promoterProfileSchema.safeParse(emptyOptionalFields)
    expect(result.success).toBe(true)
    expect(result.data).toEqual({
      name: "Test",
      email: "test@test.com",
      company: "TestCo",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      bio: "",
      website: "",
      profile_picture_url: null, // Empty string becomes null
    })
  })

  it("should validate website URL format", () => {
    const invalidWebsite = {
      name: "Test",
      email: "test@test.com",
      company: "TestCo",
      website: "not-a-url",
    }
    const result = promoterProfileSchema.safeParse(invalidWebsite)
    expect(result.success).toBe(false)
    expect(result.error?.errors[0]?.path).toEqual(["website"])

    const validWebsite = {
      name: "Test",
      email: "test@test.com",
      company: "TestCo",
      website: "http://www.example.com",
    }
    const result2 = promoterProfileSchema.safeParse(validWebsite)
    expect(result2.success).toBe(true)
  })
})
