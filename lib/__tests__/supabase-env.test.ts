import { jest } from '@jest/globals'

const ORIGINAL_ENV = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = { ...ORIGINAL_ENV }
})

afterAll(() => {
  process.env = ORIGINAL_ENV
})

describe('Supabase environment variables', () => {
  it('throws when client env vars are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    await expect(import('../supabase')).rejects.toThrow('NEXT_PUBLIC_SUPABASE_URL')
  })

  it('throws when server env vars are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    await expect(import('../supabaseServer')).rejects.toThrow('NEXT_PUBLIC_SUPABASE_URL')
  })

  it('throws when admin env vars are missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    await expect(import('../supabase/admin')).rejects.toThrow('SUPABASE_SERVICE_ROLE_KEY')
  })

  it('does not throw when all vars are set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service'

    const client = await import('../supabase')
    expect(client.supabase).toBeDefined()

    const server = await import('../supabaseServer')
    expect(server.createServerComponentClient).toBeDefined()

    const admin = await import('../supabase/admin')
    expect(admin.getSupabaseAdmin()).toBeDefined()
  })
})
