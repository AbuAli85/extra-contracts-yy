import { jest } from "@jest/globals"
import "@testing-library/jest-dom"

// Setup environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key"
process.env.NODE_ENV = "test"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: jest.fn(() => "/en"), // Default pathname with locale
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
  notFound: jest.fn(),
  redirect: jest.fn(),
}))

// Mock useToast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      ContractGeneratorForm: {
        contractNameLabel: "Contract Name",
        contractTypeLabel: "Contract Type",
        partyALabel: "Party A",
        partyBLabel: "Party B",
        promoterLabel: "Promoter",
        startDateLabel: "Start Date",
        endDateLabel: "End Date",
        contractValueLabel: "Contract Value",
        paymentTermsLabel: "Payment Terms",
        contentEnglishLabel: "Content (English)",
        contentSpanishLabel: "Content (Spanish)",
        generateContractButton: "Generate Contract",
        selectPartyPlaceholder: "Select a party",
        selectPromoterPlaceholder: "Select a promoter",
        invalidDate: "Invalid date",
      },
      ContractStatusFilter: {
        filterByStatus: "Filter by Status",
        all: "All",
        draft: "Draft",
        pendingReview: "Pending Review",
        active: "Active",
        completed: "Completed",
        terminated: "Terminated",
      },
      DatePickerWithManualInput: {
        placeholder: "Select a date",
      },
      ComboboxField: {
        selectOption: "Select an option",
        searchOptions: "Search options...",
        noOptionsFound: "No options found.",
      },
    }
    return (key: string) => translations[namespace]?.[key] || key
  }),
  useLocale: jest.fn(() => "en"),
  useMessages: jest.fn(() => ({})),
}))

// Mock Supabase modules to prevent ESM issues
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}))

jest.mock("@supabase/ssr", () => ({
  createBrowserClient: jest.fn(),
  createServerClient: jest.fn(),
}))

// Global mock for Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
    getSession: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
      list: jest.fn(),
      getPublicUrl: jest.fn(),
    })),
  },
}

// Mock Supabase client files
jest.mock("@/lib/supabase", () => ({
  supabase: mockSupabaseClient,
}))

jest.mock("@/lib/supabase/client", () => ({
  supabase: mockSupabaseClient,
}))

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

// Mock React Query
jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query")
  return {
    ...actual,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
  }
})

// Mock server actions
jest.mock("@/app/actions/contracts", () => ({
  createContract: jest.fn(),
  updateContract: jest.fn(),
  deleteContract: jest.fn(),
}))

jest.mock("@/app/actions/parties", () => ({
  createParty: jest.fn(),
  updateParty: jest.fn(),
  deleteParty: jest.fn(),
}))

jest.mock("@/app/actions/promoters", () => ({
  createPromoter: jest.fn(),
  updatePromoter: jest.fn(),
  deletePromoter: jest.fn(),
}))

// Mock file reading/writing for tests
jest.mock("fs", () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
}))

// Configure testing library
import { configure } from "@testing-library/react"

configure({
  testIdAttribute: "data-testid",
})

// Global test setup
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks()
})

// Cleanup after tests
afterEach(() => {
  // Clean up any side effects
  jest.restoreAllMocks()
})