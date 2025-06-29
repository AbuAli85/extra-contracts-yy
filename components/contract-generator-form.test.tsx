"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ContractGeneratorForm } from "./contract-generator-form"
import { createContract, updateContract } from "@/app/actions/contracts"
import { useToast } from "@/components/ui/use-toast"
import jest from "jest" // Import jest to declare it

// Mock next-intl useTranslations
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock server actions and data fetching
jest.mock("@/app/actions/contracts", () => ({
  createContract: jest.fn(),
  updateContract: jest.fn(),
}))
jest.mock("@/lib/data", () => ({
  getParties: jest.fn(() =>
    Promise.resolve([
      { id: "p1", name_en: "Party A", name_ar: "الطرف أ", type: "Client" },
      { id: "p2", name_en: "Party B", name_ar: "الطرف ب", type: "Vendor" },
    ]),
  ),
  getPromoters: jest.fn(() =>
    Promise.resolve([
      { id: "pr1", name_en: "Promoter X", name_ar: "المروج س", email: "x@example.com" },
      { id: "pr2", name_en: "Promoter Y", name_ar: "المروج ص", email: "y@example.com" },
    ]),
  ),
}))
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe("ContractGeneratorForm", () => {
  const mockToast = useToast().toast as jest.Mock
  const mockCreateContract = createContract as jest.Mock
  const mockUpdateContract = updateContract as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the form fields correctly", async () => {
    render(<ContractGeneratorForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/First Party $$English$$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/First Party $$Arabic$$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Second Party $$English$$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Second Party $$Arabic$$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Promoter $$English$$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Promoter $$Arabic$$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Contract Type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Contract Content $$English$$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Contract Content $$Arabic$$/i)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /Generate Contract/i })).toBeInTheDocument()
    })
  })

  it("pre-fills form with initialData when provided", async () => {
    const initialData = {
      firstPartyNameEn: "Initial Party1 EN",
      firstPartyNameAr: "Initial Party1 AR",
      secondPartyNameEn: "Initial Party2 EN",
      secondPartyNameAr: "Initial Party2 AR",
      promoterNameEn: "Initial Promoter EN",
      promoterNameAr: "Initial Promoter AR",
      contractType: "Service Agreement",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      contentEn: "Initial English content.",
      contentAr: "Initial Arabic content.",
    }

    render(<ContractGeneratorForm initialData={initialData} />)

    await waitFor(() => {
      expect(screen.getByLabelText(/First Party $$English$$/i)).toHaveValue("Initial Party1 EN")
      expect(screen.getByLabelText(/Contract Content $$English$$/i)).toHaveValue("Initial English content.")
    })
  })

  it("calls createContract on submission for new contract", async () => {
    render(<ContractGeneratorForm />)

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/First Party $$English$$/i), {
        target: { value: "New Party1 EN" },
      })
      fireEvent.change(screen.getByLabelText(/First Party $$Arabic$$/i), {
        target: { value: "New Party1 AR" },
      })
      fireEvent.change(screen.getByLabelText(/Second Party $$English$$/i), {
        target: { value: "New Party2 EN" },
      })
      fireEvent.change(screen.getByLabelText(/Second Party $$Arabic$$/i), {
        target: { value: "New Party2 AR" },
      })
      fireEvent.change(screen.getByLabelText(/Promoter $$English$$/i), {
        target: { value: "New Promoter EN" },
      })
      fireEvent.change(screen.getByLabelText(/Promoter $$Arabic$$/i), {
        target: { value: "New Promoter AR" },
      })
      fireEvent.change(screen.getByLabelText(/Contract Type/i), {
        target: { value: "NDA" },
      })
      // For date pickers, we might need to simulate more complex interactions or just set the value directly if possible
      // For simplicity in testing, let's assume direct value setting works for now or mock the component
      fireEvent.change(screen.getByLabelText(/Start Date/i), {
        target: { value: "2024-01-01" },
      })
      fireEvent.change(screen.getByLabelText(/End Date/i), {
        target: { value: "2024-12-31" },
      })
      fireEvent.change(screen.getByLabelText(/Contract Content $$English$$/i), {
        target: { value: "Test English content." },
      })
      fireEvent.change(screen.getByLabelText(/Contract Content $$Arabic$$/i), {
        target: { value: "Test Arabic content." },
      })
    })

    fireEvent.click(screen.getByRole("button", { name: /Generate Contract/i }))

    await waitFor(() => {
      expect(mockCreateContract).toHaveBeenCalledTimes(1)
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: "contractForm.successTitle" }))
    })
  })

  it("calls updateContract on submission for existing contract", async () => {
    const contractId = "some-contract-id"
    const initialData = {
      firstPartyNameEn: "Existing Party1 EN",
      firstPartyNameAr: "Existing Party1 AR",
      secondPartyNameEn: "Existing Party2 EN",
      secondPartyNameAr: "Existing Party2 AR",
      promoterNameEn: "Existing Promoter EN",
      promoterNameAr: "Existing Promoter AR",
      contractType: "Consulting",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      contentEn: "Existing English content.",
      contentAr: "Existing Arabic content.",
    }

    render(<ContractGeneratorForm initialData={initialData} contractId={contractId} />)

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/First Party $$English$$/i), {
        target: { value: "Updated Party1 EN" },
      })
    })

    fireEvent.click(screen.getByRole("button", { name: /Update Contract/i }))

    await waitFor(() => {
      expect(mockUpdateContract).toHaveBeenCalledTimes(1)
      expect(mockUpdateContract).toHaveBeenCalledWith(
        contractId,
        expect.objectContaining({ firstPartyNameEn: "Updated Party1 EN" }),
      )
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: "contractForm.updateSuccessTitle" }))
    })
  })

  it("displays validation errors for invalid input", async () => {
    render(<ContractGeneratorForm />)

    fireEvent.click(screen.getByRole("button", { name: /Generate Contract/i }))

    await waitFor(() => {
      expect(screen.getByText(/First Party English name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Contract type is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Start date is required/i)).toBeInTheDocument()
      expect(screen.getByText(/End date is required/i)).toBeInTheDocument()
      expect(screen.getByText(/English content is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Arabic content is required/i)).toBeInTheDocument()
    })
  })
})
