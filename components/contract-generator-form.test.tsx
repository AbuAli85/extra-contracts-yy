import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ContractGeneratorForm } from "./contract-generator-form"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useParties } from "@/hooks/use-parties"
import { usePromoters } from "@/hooks/use-promoters"
import { createContract, updateContract } from "@/app/actions/contracts"
import { NextIntlClientProvider } from "next-intl"
import messages from "@/messages/en.json" // Import your English messages file
import jest from "jest" // Import jest to declare it

// Mock next-intl useTranslations
jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace: string) => {
    // Simple mock translation function
    const translations: { [key: string]: { [key: string]: string } } = {
      ContractGeneratorForm: {
        contractNameLabel: "Contract Name",
        contractTypeLabel: "Contract Type",
        partyALabel: "Party A",
        partyBLabel: "Party B",
        promoterLabel: "Promoter",
        effectiveDateLabel: "Effective Date",
        terminationDateLabel: "Termination Date",
        contractValueLabel: "Contract Value",
        paymentTermsLabel: "Payment Terms",
        contentEnglishLabel: "Content (English)",
        contentSpanishLabel: "Content (Spanish)",
        submitButton: "Generate Contract",
        updateButton: "Update Contract",
        successMessage: "Contract generated successfully!",
        updateSuccessMessage: "Contract updated successfully!",
        errorMessage: "Failed to generate contract.",
        updateErrorMessage: "Failed to update contract.",
        loadingParties: "Loading parties...",
        loadingPromoters: "Loading promoters...",
        selectParty: "Select Party",
        selectPromoter: "Select Promoter",
        searchParties: "Search parties...",
        searchPromoters: "Search promoters...",
        noPartiesFound: "No parties found.",
        noPromotersFound: "No promoters found.",
        required: "This field is required",
        invalidNumber: "Must be a valid number",
        invalidDate: "Invalid date",
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
}))

// Mock react-query hooks
jest.mock("@/hooks/use-parties", () => ({
  useParties: jest.fn(),
}))
jest.mock("@/hooks/use-promoters", () => ({
  usePromoters: jest.fn(),
}))

// Mock server actions
jest.mock("@/app/actions/contracts", () => ({
  createContract: jest.fn(),
  updateContract: jest.fn(),
}))

const queryClient = new QueryClient()

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <NextIntlClientProvider messages={messages}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </NextIntlClientProvider>,
  )
}

describe("ContractGeneratorForm", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Default mock implementations
    ;(useParties as jest.Mock).mockReturnValue({
      data: [
        {
          id: "party1",
          name: "Party One",
          type: "Individual",
          contact_email: "p1@example.com",
          contact_phone: "111",
          address: "123 Main",
        },
        {
          id: "party2",
          name: "Party Two",
          type: "Company",
          contact_email: "p2@example.com",
          contact_phone: "222",
          address: "456 Oak",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    })
    ;(usePromoters as jest.Mock).mockReturnValue({
      data: [
        {
          id: "promoter1",
          name: "Promoter Alpha",
          contact_email: "pa@example.com",
          contact_phone: "333",
          company_name: "Alpha Corp",
          website: "alpha.com",
          profile_picture_url: null,
        },
        {
          id: "promoter2",
          name: "Promoter Beta",
          contact_email: "pb@example.com",
          contact_phone: "444",
          company_name: "Beta Inc",
          website: "beta.com",
          profile_picture_url: null,
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    })
    ;(createContract as jest.Mock).mockResolvedValue({ success: true, message: "Contract generated successfully!" })
    ;(updateContract as jest.Mock).mockResolvedValue({ success: true, message: "Contract updated successfully!" })
  })

  it("renders the form fields correctly", () => {
    renderWithProviders(<ContractGeneratorForm />)

    expect(screen.getByLabelText(/Contract Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contract Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Party A/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Party B/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Promoter/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Effective Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Termination Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contract Value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Payment Terms/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Content $$English$$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Content $$Spanish$$/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Generate Contract/i })).toBeInTheDocument()
  })

  it("displays loading states for parties and promoters", () => {
    ;(useParties as jest.Mock).mockReturnValue({ data: [], isLoading: true, isError: false, error: null })
    ;(usePromoters as jest.Mock).mockReturnValue({ data: [], isLoading: true, isError: false, error: null })

    renderWithProviders(<ContractGeneratorForm />)

    expect(screen.getByText(/Loading parties.../i)).toBeInTheDocument()
    expect(screen.getByText(/Loading promoters.../i)).toBeInTheDocument()
  })

  it("displays error states for parties and promoters", () => {
    ;(useParties as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error("Failed to load parties"),
    })
    ;(usePromoters as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error("Failed to load promoters"),
    })

    renderWithProviders(<ContractGeneratorForm />)

    expect(screen.getByText(/Failed to load parties/i)).toBeInTheDocument()
    expect(screen.getByText(/Failed to load promoters/i)).toBeInTheDocument()
  })

  it("submits the form with new contract data", async () => {
    renderWithProviders(<ContractGeneratorForm />)

    fireEvent.change(screen.getByLabelText(/Contract Name/i), { target: { value: "Test Contract" } })
    fireEvent.change(screen.getByLabelText(/Contract Type/i), { target: { value: "Service" } })
    fireEvent.change(screen.getByLabelText(/Content $$English$$/i), { target: { value: "English content here." } })
    fireEvent.change(screen.getByLabelText(/Content $$Spanish$$/i), { target: { value: "Spanish content here." } })

    // Select Party A
    fireEvent.click(screen.getByLabelText(/Party A/i))
    await waitFor(() => screen.getByText("Party One"))
    fireEvent.click(screen.getByText("Party One"))

    // Select Party B
    fireEvent.click(screen.getByLabelText(/Party B/i))
    await waitFor(() => screen.getByText("Party Two"))
    fireEvent.click(screen.getByText("Party Two"))

    fireEvent.click(screen.getByRole("button", { name: /Generate Contract/i }))

    await waitFor(() => {
      expect(createContract).toHaveBeenCalledTimes(1)
      const formData = (createContract as jest.Mock).mock.calls[0][1]
      expect(formData.get("contractName")).toBe("Test Contract")
      expect(formData.get("contractType")).toBe("Service")
      expect(formData.get("partyA")).toBe("party1")
      expect(formData.get("partyB")).toBe("party2")
      expect(formData.get("contentEnglish")).toBe("English content here.")
      expect(formData.get("contentSpanish")).toBe("Spanish content here.")
    })

    expect(screen.getByText(/Contract generated successfully!/i)).toBeInTheDocument()
  })

  it("displays validation errors for required fields", async () => {
    renderWithProviders(<ContractGeneratorForm />)

    fireEvent.click(screen.getByRole("button", { name: /Generate Contract/i }))

    await waitFor(() => {
      expect(screen.getByText(/Contract name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Contract type is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Party A is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Party B is required/i)).toBeInTheDocument()
      expect(screen.getByText(/English content is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Spanish content is required/i)).toBeInTheDocument()
    })
  })

  it("pre-fills form for editing existing contract", async () => {
    const existingContract = {
      id: "contract123",
      contract_name: "Existing Contract",
      contract_type: "Consulting",
      party_a_id: "party1",
      party_b_id: "party2",
      promoter_id: "promoter1",
      effective_date: "2023-01-01T00:00:00.000Z",
      termination_date: "2023-12-31T00:00:00.000Z",
      contract_value: 10000,
      payment_terms: "Net 30",
      content_english: "Existing English content.",
      content_spanish: "Existing Spanish content.",
      status: "Active",
      created_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-01T00:00:00.000Z",
      parties_a: { name: "Party One" },
      parties_b: { name: "Party Two" },
      promoters: { name: "Promoter Alpha" },
    }

    renderWithProviders(<ContractGeneratorForm contract={existingContract} />)

    expect(screen.getByLabelText(/Contract Name/i)).toHaveValue("Existing Contract")
    expect(screen.getByLabelText(/Contract Type/i)).toHaveValue("Consulting")
    expect(screen.getByText("Party One")).toBeInTheDocument() // Combobox displays label
    expect(screen.getByText("Party Two")).toBeInTheDocument() // Combobox displays label
    expect(screen.getByText("Promoter Alpha")).toBeInTheDocument() // Combobox displays label
    expect(screen.getByLabelText(/Contract Value/i)).toHaveValue("10000")
    expect(screen.getByLabelText(/Payment Terms/i)).toHaveValue("Net 30")
    expect(screen.getByLabelText(/Content $$English$$/i)).toHaveValue("Existing English content.")
    expect(screen.getByLabelText(/Content $$Spanish$$/i)).toHaveValue("Existing Spanish content.")
    expect(screen.getByRole("button", { name: /Update Contract/i })).toBeInTheDocument()
  })

  it("updates an existing contract", async () => {
    const existingContract = {
      id: "contract123",
      contract_name: "Existing Contract",
      contract_type: "Consulting",
      party_a_id: "party1",
      party_b_id: "party2",
      promoter_id: "promoter1",
      effective_date: "2023-01-01T00:00:00.000Z",
      termination_date: "2023-12-31T00:00:00.000Z",
      contract_value: 10000,
      payment_terms: "Net 30",
      content_english: "Existing English content.",
      content_spanish: "Existing Spanish content.",
      status: "Active",
      created_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-01T00:00:00.000Z",
      parties_a: { name: "Party One" },
      parties_b: { name: "Party Two" },
      promoters: { name: "Promoter Alpha" },
    }

    renderWithProviders(<ContractGeneratorForm contract={existingContract} />)

    fireEvent.change(screen.getByLabelText(/Contract Name/i), { target: { value: "Updated Contract Name" } })
    fireEvent.click(screen.getByRole("button", { name: /Update Contract/i }))

    await waitFor(() => {
      expect(updateContract).toHaveBeenCalledTimes(1)
      expect(updateContract).toHaveBeenCalledWith(
        "contract123",
        expect.any(Object), // prevState
        expect.any(FormData),
      )
      const formData = (updateContract as jest.Mock).mock.calls[0][2]
      expect(formData.get("contractName")).toBe("Updated Contract Name")
    })

    expect(screen.getByText(/Contract updated successfully!/i)).toBeInTheDocument()
  })
})
