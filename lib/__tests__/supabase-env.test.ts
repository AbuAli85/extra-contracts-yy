import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals"

const originalEnv = { ...process.env }

describe("Supabase module environment checks", () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("throws if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(() => require("../supabase")).toThrow(
      "Supabase URL and Anon Key must be defined in environment variables.",
    )
  })

  it("throws if SUPABASE_SERVICE_ROLE_KEY is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY

    expect(() => require("../supabaseServer")).toThrow(
      "Supabase URL and Service Role Key must be defined in environment variables for server-side operations.",
    )
  })
})
