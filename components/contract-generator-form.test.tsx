import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ContractGeneratorForm from "./contract-generator-form"

const toastMock = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}))

import { useParties } from "@/hooks/use-parties"
import { usePromoters } from "@/hooks/use-promoters"

jest.mock("@/hooks/use-parties")
jest.mock("@/hooks/use-promoters")

const mockUseParties = useParties as jest.Mock
const mockUsePromoters = usePromoters as jest.Mock

const originalFetch = global.fetch
const insertMock = jest.fn(() => Promise.resolve({ error: null }))
const fromMock = jest.fn(() => ({ insert: insertMock }))

jest.mock("@/lib/supabase", () => ({
  supabase: { from: fromMock },
}))

const employerParty = {
  id: "party-employer-1",
  name_en: "Test Employer EN",
  name_ar: "Test Employer AR",
  crn: "CRN123",
  type: "Employer",
}
const clientParty = {
  id: "party-client-1",
  name_en: "Test Client EN",
  name_ar: "Test Client AR",
  crn: "CL123",
  type: "Client",
}
const promoter = {
  id: "promoter-1",
  name_en: "Test Promoter EN",
  name_ar: "Test Promoter AR",
  id_card_number: "ID123",
}

function renderForm() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <ContractGeneratorForm />
    </QueryClientProvider>,
  )
}

describe("ContractGeneratorForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseParties.mockImplementation((type: string) => {
      if (type === "Employer") {
        return { data: [employerParty], isLoading: false, error: undefined }
      }
      if (type === "Client") {
        return { data: [clientParty], isLoading: false, error: undefined }
      }
      return { data: [], isLoading: false, error: undefined }
    })
    mockUsePromoters.mockReturnValue({
      data: [promoter],
      isLoading: false,
      error: undefined,
    })
    process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL = "https://example.com/hook"
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock
  })

  afterEach(() => {
    global.fetch = originalFetch
    delete process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
  })

  test("shows validation errors when required fields are missing", async () => {
    renderForm()
    const user = userEvent.setup()
    await user.click(screen.getByRole("button", { name: /generate/i }))
    expect(await screen.findByText("Please select Party A.")).toBeInTheDocument()
    expect(await screen.findByText("Please select Party B.")).toBeInTheDocument()
    expect(await screen.findByText("Please select a Promoter.")).toBeInTheDocument()
    expect(await screen.findByText("Contract start date is required.")).toBeInTheDocument()
    expect(await screen.findByText("Contract end date is required.")).toBeInTheDocument()
    expect(await screen.findByText("Please enter a valid email address for notifications.")).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  test("submits form with valid data", async () => {
    renderForm()
    const user = userEvent.setup()

    const employerTrigger = screen.getByRole("combobox", { name: /select employer/i })
    await user.click(employerTrigger)
    await user.click(screen.getByRole("option", { name: /test employer en/i }))

    const clientTrigger = screen.getByRole("combobox", { name: /select client/i })
    await user.click(clientTrigger)
    await user.click(screen.getByRole("option", { name: /test client en/i }))

    const promoterCombo = screen.getByRole("combobox", { name: /select a promoter/i })
    await user.click(promoterCombo)
    await user.click(screen.getByRole("option", { name: /test promoter en/i }))

    await user.type(screen.getByLabelText("Contract Start Date"), "01-01-2025")
    await user.type(screen.getByLabelText("Contract End Date"), "02-01-2025")
    await user.type(screen.getByLabelText("Notification Email"), "test@example.com")

    await user.click(screen.getByRole("button", { name: /generate/i }))

    await waitFor(() => expect(insertMock).toHaveBeenCalled())
    expect(fromMock).toHaveBeenCalledWith("contracts")
    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/hook",
      expect.objectContaining({ method: "POST" }),
    )
    expect(toastMock).toHaveBeenCalled()
  })
})
