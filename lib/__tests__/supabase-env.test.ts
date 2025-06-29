import { getSupabaseClient, getSupabaseAdmin } from "../supabase"
import jest from "jest" // Declare the jest variable

describe("Supabase Environment Variables", () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  it("should throw error if NEXT_PUBLIC_SUPABASE_URL is missing for client", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    expect(() => getSupabaseClient()).toThrow("Missing NEXT_PUBLIC_SUPABASE_URL")
  })

  it("should throw error if NEXT_PUBLIC_SUPABASE_ANON_KEY is missing for client", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(() => getSupabaseClient()).toThrow("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")
  })

  it("should return a Supabase client if client env vars are present", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"
    const client = getSupabaseClient()
    expect(client).toBeDefined()
    // You might want to add more specific checks if your mock allows it,
    // e.g., checking if `from` method exists.
    expect(typeof client.from).toBe("function")
  })

  it("should throw error if SUPABASE_SERVICE_ROLE_KEY is missing for admin", () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    expect(() => getSupabaseAdmin()).toThrow("Missing SUPABASE_SERVICE_ROLE_KEY")
  })

  it("should return a Supabase admin client if admin env vars are present", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321"
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key"
    const adminClient = getSupabaseAdmin()
    expect(adminClient).toBeDefined()
    expect(typeof adminClient.from).toBe("function")
  })
})
