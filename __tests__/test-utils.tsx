import React from "react"
import { render, RenderOptions } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NextIntlClientProvider } from "next-intl"
import { jest } from "@jest/globals"

// Import messages for testing
import messages from "@/i18n/messages/en.json"

// Create a fresh QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

// Test wrapper component
interface TestProvidersProps {
  children: React.ReactNode
  queryClient?: QueryClient
  locale?: string
  customMessages?: any
}

export function TestProviders({
  children,
  queryClient = createTestQueryClient(),
  locale = "en",
  customMessages = messages,
}: TestProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={customMessages}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient
  locale?: string
  customMessages?: any
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    locale = "en",
    customMessages = messages,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <TestProviders
        queryClient={queryClient}
        locale={locale}
        customMessages={customMessages}
      >
        {children}
      </TestProviders>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

// Mock translations helper
export const createMockTranslations = (translations: Record<string, Record<string, string>>) => {
  return jest.fn((namespace: string) => {
    return (key: string) => translations[namespace]?.[key] || key
  })
}

// Common test data generators
export const generateMockContract = (overrides: Partial<any> = {}) => ({
  id: "test-contract-1",
  contract_name: "Test Contract",
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
  ...overrides,
})

export const generateMockParty = (overrides: Partial<any> = {}) => ({
  id: "test-party-1",
  name: "Test Party",
  type: "Individual",
  contact_email: "party@example.com",
  contact_phone: "123-456-7890",
  address: "123 Main St",
  city: "Test City",
  state: "CA",
  zip_code: "90210",
  country: "USA",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  ...overrides,
})

export const generateMockPromoter = (overrides: Partial<any> = {}) => ({
  id: "test-promoter-1",
  name: "Test Promoter",
  email: "promoter@example.com",
  phone: "123-456-7890",
  company: "Test Company",
  address: "123 Promoter St",
  city: "Promoter City",
  state: "CA",
  zip_code: "90210",
  country: "USA",
  bio: "Test bio",
  website: "https://test.example.com",
  profile_picture_url: null,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  ...overrides,
})

// Mock form data helper
export const createMockFormData = (data: Record<string, any>) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  return formData
}

// User interaction helpers
export const fillForm = async (fields: Record<string, string>) => {
  const { fireEvent, screen } = await import("@testing-library/react")
  
  for (const [label, value] of Object.entries(fields)) {
    const input = screen.getByLabelText(new RegExp(label, "i"))
    fireEvent.change(input, { target: { value } })
  }
}

export const selectOption = async (label: string, option: string) => {
  const { fireEvent, screen, waitFor } = await import("@testing-library/react")
  
  const select = screen.getByLabelText(new RegExp(label, "i"))
  fireEvent.click(select)
  
  await waitFor(() => screen.getByText(option))
  fireEvent.click(screen.getByText(option))
}

export const clickButton = async (buttonText: string) => {
  const { fireEvent, screen } = await import("@testing-library/react")
  
  const button = screen.getByRole("button", { name: new RegExp(buttonText, "i") })
  fireEvent.click(button)
}

// Wait helpers
export const waitForLoadingToFinish = async () => {
  const { waitForElementToBeRemoved, screen } = await import("@testing-library/react")
  
  try {
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading"))
  } catch {
    // Loading element might not exist
  }
}

export const waitForErrorToAppear = async (errorText: string) => {
  const { waitFor, screen } = await import("@testing-library/react")
  
  await waitFor(() => {
    expect(screen.getByText(new RegExp(errorText, "i"))).toBeInTheDocument()
  })
}

// Common test setup and teardown
export const setupTest = () => {
  const queryClient = createTestQueryClient()
  
  // Reset all mocks
  jest.clearAllMocks()
  
  return { queryClient }
}

export const cleanupTest = (queryClient: QueryClient) => {
  queryClient.clear()
  jest.clearAllMocks()
}

// Environment variable setup for tests
export const mockEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
}

export const setupEnvVars = () => {
  Object.assign(process.env, mockEnvVars)
}

// Export common testing utilities
export * from "@testing-library/react"
export { default as userEvent } from "@testing-library/user-event"