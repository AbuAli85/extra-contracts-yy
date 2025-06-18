import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ContractGeneratorForm from "./contract-generator-form"
import { toast } from "sonner"

const mockUseParties = jest.fn()
const mockUsePromoters = jest.fn()

jest.mock("@/hooks/use-parties", () => ({
  useParties: (...args: any) => mockUseParties(...args),
}))

jest.mock("@/hooks/use-promoters", () => ({
  usePromoters: (...args: any) => mockUsePromoters(...args),
}))

const renderForm = () => {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <ContractGeneratorForm />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mockUseParties.mockImplementation((type: "Employer" | "Client") => ({
    data: [
      {
        id: type === "Employer" ? "party-employer-1" : "party-client-1",
        name_en: `Test ${type} EN`,
        name_ar: `Test ${type} AR`,
        crn: "CRN123",
        type,
      },
    ],
    isLoading: false,
    error: undefined,
  }))

  mockUsePromoters.mockReturnValue({
    data: [
      {
        id: "promoter-1",
        name_en: "Test Promoter EN",
        name_ar: "Test Promoter AR",
        id_card_number: "ID123",
      },
    ],
    isLoading: false,
    error: undefined,
  })

  ;(toast.success as jest.Mock).mockClear()
  ;(toast.error as jest.Mock).mockClear()
  ;(global as any).fetch = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

test("renders the contract generator form", () => {
  renderForm()
  expect(
    screen.getByRole("button", { name: /generate & save contract/i }),
  ).toBeInTheDocument()
  expect(screen.getByText(/contracting parties/i)).toBeInTheDocument()
})

test("submits form data and shows success toast", async () => {
  ;(global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      message: "Contract generated",
      contract: {
        id: "new-contract-id",
        pdf_url: "http://mockurl.com/contract.pdf",
      },
    }),
  })

  renderForm()
  const user = userEvent.setup()

  await user.click(screen.getByLabelText(/party a/i))
  await user.click(screen.getByRole("option", { name: /test employer en/i }))
  await user.click(screen.getByLabelText(/party b/i))
  await user.click(screen.getByRole("option", { name: /test client en/i }))

  await user.click(screen.getByRole("combobox"))
  await user.click(screen.getByRole("option", { name: /test promoter en/i }))

  const [startInput, endInput] = screen.getAllByPlaceholderText("dd-MM-yyyy")
  await user.type(startInput, "01-01-2024")
  await user.type(endInput, "02-01-2024")
  await user.type(
    screen.getByPlaceholderText("contact@example.com"),
    "user@example.com",
  )

  await user.click(screen.getByRole("button", { name: /generate & save contract/i }))

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/contracts",
      expect.objectContaining({ method: "POST" }),
    )
    expect(toast.success).toHaveBeenCalled()
  })
})

test("shows validation errors when required fields are missing", async () => {
  ;(global as any).fetch = jest.fn()
  renderForm()
  const user = userEvent.setup()

  await user.click(screen.getByRole("button", { name: /generate & save contract/i }))

  expect(await screen.findByText(/please select party a/i)).toBeInTheDocument()
  expect(global.fetch).not.toHaveBeenCalled()
})
