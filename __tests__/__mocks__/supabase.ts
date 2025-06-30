import { jest } from "@jest/globals"

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
    getSession: jest.fn(),
    signOut: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    containedBy: jest.fn().mockReturnThis(),
    rangeGt: jest.fn().mockReturnThis(),
    rangeGte: jest.fn().mockReturnThis(),
    rangeLt: jest.fn().mockReturnThis(),
    rangeLte: jest.fn().mockReturnThis(),
    rangeAdjacent: jest.fn().mockReturnThis(),
    overlaps: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    abortSignal: jest.fn().mockReturnThis(),
    single: jest.fn(),
    maybeSingle: jest.fn(),
    csv: jest.fn(),
    geojson: jest.fn(),
    explain: jest.fn(),
    rollback: jest.fn(),
    returns: jest.fn(),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      move: jest.fn(),
      copy: jest.fn(),
      createSignedUrl: jest.fn(),
      createSignedUrls: jest.fn(),
      getPublicUrl: jest.fn(),
    })),
  },
  realtime: {
    channel: jest.fn(() => ({
      on: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    })),
  },
  rpc: jest.fn(),
}

// Mock data for testing
export const mockContracts = [
  {
    id: "1",
    contract_name: "Test Contract 1",
    contract_type: "Service",
    status: "Draft",
    party_a_id: "party-1",
    party_b_id: "party-2",
    promoter_id: "promoter-1",
    effective_date: "2023-01-01",
    termination_date: "2024-01-01",
    contract_value: 1000,
    payment_terms: "Net 30",
    content_english: "English content",
    content_spanish: "Spanish content",
    is_template: false,
    is_archived: false,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    contract_name: "Test Contract 2",
    contract_type: "Sales",
    status: "Active",
    party_a_id: "party-1",
    party_b_id: "party-3",
    promoter_id: "promoter-2",
    effective_date: "2023-02-01",
    termination_date: "2024-02-01",
    contract_value: 2000,
    payment_terms: "Net 15",
    content_english: "English content 2",
    content_spanish: "Spanish content 2",
    is_template: false,
    is_archived: false,
    created_at: "2023-02-01T00:00:00Z",
    updated_at: "2023-02-01T00:00:00Z",
  },
]

export const mockParties = [
  {
    id: "party-1",
    name: "Party One",
    type: "Individual",
    contact_email: "party1@example.com",
    contact_phone: "123-456-7890",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip_code: "90210",
    country: "USA",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "party-2",
    name: "Party Two",
    type: "Company",
    contact_email: "party2@example.com",
    contact_phone: "098-765-4321",
    address: "456 Oak Ave",
    city: "Another City",
    state: "NY",
    zip_code: "10001",
    country: "USA",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
]

export const mockPromoters = [
  {
    id: "promoter-1",
    name: "Promoter Alpha",
    email: "alpha@example.com",
    phone: "111-222-3333",
    company: "Alpha Corp",
    address: "789 Pine St",
    city: "Promoter City",
    state: "TX",
    zip_code: "75001",
    country: "USA",
    bio: "Experienced promoter",
    website: "https://alpha.example.com",
    profile_picture_url: null,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "promoter-2",
    name: "Promoter Beta",
    email: "beta@example.com",
    phone: "444-555-6666",
    company: "Beta Inc",
    address: "321 Elm St",
    city: "Beta City",
    state: "FL",
    zip_code: "33101",
    country: "USA",
    bio: "Music industry expert",
    website: "https://beta.example.com",
    profile_picture_url: null,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
]

// Helper functions for mocking responses
export const createMockResponse = <T>(data: T, error: any = null) => ({
  data,
  error,
  count: Array.isArray(data) ? data.length : data ? 1 : 0,
  status: error ? 400 : 200,
  statusText: error ? "Bad Request" : "OK",
})

export const createMockError = (message: string, details?: string) => ({
  message,
  details,
  hint: null,
  code: "PGRST000",
})

// Reset all mocks helper
export const resetSupabaseMocks = () => {
  jest.clearAllMocks()
  
  // Set default implementations
  mockSupabaseClient.from().single.mockResolvedValue(createMockResponse(mockContracts[0]))
  mockSupabaseClient.from().select().mockResolvedValue(createMockResponse(mockContracts))
  mockSupabaseClient.from().insert().mockResolvedValue(createMockResponse(mockContracts[0]))
  mockSupabaseClient.from().update().mockResolvedValue(createMockResponse(mockContracts[0]))
  mockSupabaseClient.from().delete().mockResolvedValue(createMockResponse(null))
}

// Setup specific mock scenarios
export const mockSupabaseSuccess = () => {
  resetSupabaseMocks()
}

export const mockSupabaseError = (message: string = "Database error") => {
  const error = createMockError(message)
  mockSupabaseClient.from().single.mockResolvedValue(createMockResponse(null, error))
  mockSupabaseClient.from().select().mockResolvedValue(createMockResponse(null, error))
  mockSupabaseClient.from().insert().mockResolvedValue(createMockResponse(null, error))
  mockSupabaseClient.from().update().mockResolvedValue(createMockResponse(null, error))
  mockSupabaseClient.from().delete().mockResolvedValue(createMockResponse(null, error))
}

export const mockSupabaseAuth = (user: any = null, session: any = null) => {
  mockSupabaseClient.auth.getUser.mockResolvedValue({
    data: { user },
    error: null,
  })
  mockSupabaseClient.auth.getSession.mockResolvedValue({
    data: { session },
    error: null,
  })
}