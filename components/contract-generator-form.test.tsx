"use client"

import type React from "react"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ContractGeneratorForm } from "./contract-generator-form"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NextIntlClientProvider } from "next-intl/client"
import messages from "@/messages/en.json" // Adjust path as necessary
import { act } from "react-dom/test-utils"
import jest from "jest" // Import jest to declare it

// Mock the server actions
jest.mock("@/app/actions/contracts", () => ({
  createContract: jest.fn((_prevState, formData) => {
    const data = Object.fromEntries(formData.entries())
    if (data.contract_name === "Test Contract Success") {
      return Promise.resolve({ success: true, message: "Contract created successfully!" })
    }
    return Promise.resolve({ success: false, message: "Failed to create contract." })
  }),
  updateContract: jest.fn((_id, _prevState, formData) => {
    const data = Object.fromEntries(formData.entries())
    if (data.contract_name === "Updated Contract Success") {
      return Promise.resolve({ success: true, message: "Contract updated successfully!" })
    }
    return Promise.resolve({ success: false, message: "Failed to update contract." })
  }),
}))

jest.mock("@/app/actions/parties", () => ({
  getParties: jest.fn(() => Promise.resolve({ data: [{ id: "party1", name: "Party A" }], success: true })),
}))

jest.mock("@/app/actions/promoters", () => ({
  getPromoters: jest.fn(() => Promise.resolve({ data: [{ id: "promoter1", name: "Promoter X" }], success: true })),
}))

// Mock useToast
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock next-intl useTranslations
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key, // Simple mock that returns the key
}))

const queryClient = new QueryClient()

const mockParties = [
  { id: "party1", name: "Party A", email: "a@example.com", phone: "111", address: "123 Main", type: "Individual" },
  { id: "party2", name: "Party B", email: "b@example.com", phone: "222", address: "456 Oak", type: "Company" },
]

const mockPromoters = [
  {
    id: "promoter1",
    name: "Promoter X",
    email: "x@example.com",
    phone: "333",
    company: "X Corp",
    address: "789 Pine",
    city: "CityX",
    state: "ST",
    zip_code: "12345",
    country: "USA",
    bio: "BioX",
    profile_picture_url: null,
  },
  {
    id: "promoter2",
    name: "Promoter Y",
    email: "y@example.com",
    phone: "444",
    company: "Y Inc",
    address: "101 Elm",
    city: "CityY",
    state: "ST",
    zip_code: "67890",
    country: "USA",
    bio: "BioY",
    profile_picture_url: null,
  },
]

const renderWithProviders = (ui: React.ReactElement, { locale = "en" } = {}) => {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </NextIntlClientProvider>,
  )
}

describe("ContractGeneratorForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the form fields correctly for creation", async () => {
    renderWithProviders(<ContractGeneratorForm parties={mockParties} promoters={mockPromoters} />)

    expect(screen.getByLabelText(/contractName/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contractType/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/partyA/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/partyB/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/promoter/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/effectiveDate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/terminationDate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contractValue/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/paymentTerms/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contentEnglish/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contentSpanish/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /createContract/i })).toBeInTheDocument()
  })

  it("submits the form successfully for creation", async () => {
    const { createContract } = require("@/app/actions/contracts")
    const { toast } = require("@/components/ui/use-toast")
    const { useRouter } = require("next/navigation")

    renderWithProviders(<ContractGeneratorForm parties={mockParties} promoters={mockPromoters} />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/contractName/i), { target: { value: "Test Contract Success" } })
      fireEvent.change(screen.getByLabelText(/contractType/i), { target: { value: "Service" } })
      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: "Draft" } })
      fireEvent.change(screen.getByLabelText(/contractValue/i), { target: { value: "1000" } })
      fireEvent.change(screen.getByLabelText(/paymentTerms/i), { target: { value: "Net 30" } })
      fireEvent.change(screen.getByLabelText(/contentEnglish/i), { target: { value: "English content" } })
      fireEvent.change(screen.getByLabelText(/contentSpanish/i), { target: { value: "Spanish content" } })

      // Select Party A
      fireEvent.mouseDown(screen.getByRole("button", { name: /selectPartyA/i }))
      await waitFor(() => expect(screen.getByText("Party A")).toBeInTheDocument())
      fireEvent.click(screen.getByText("Party A"))

      // Select Party B
      fireEvent.mouseDown(screen.getByRole("button", { name: /selectPartyB/i }))
      await waitFor(() => expect(screen.getByText("Party B")).toBeInTheDocument())
      fireEvent.click(screen.getByText("Party B"))

      // Select Promoter
      fireEvent.mouseDown(screen.getByRole("button", { name: /selectPromoter/i }))
      await waitFor(() => expect(screen.getByText("Promoter X")).toBeInTheDocument())
      fireEvent.click(screen.getByText("Promoter X"))

      fireEvent.click(screen.getByRole("button", { name: /createContract/i }))
    })

    await waitFor(() => {
      expect(createContract).toHaveBeenCalled()
      expect(toast).toHaveBeenCalledWith({
        title: "success",
        description: "Contract created successfully!",
      })
      expect(useRouter().push).toHaveBeenCalledWith("/contracts")
      expect(useRouter().refresh).toHaveBeenCalled()
    })
  })

  it("displays error message on failed submission for creation", async () => {
    const { createContract } = require("@/app/actions/contracts")
    const { toast } = require("@/components/ui/use-toast")

    renderWithProviders(<ContractGeneratorForm parties={mockParties} promoters={mockPromoters} />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/contractName/i), { target: { value: "Failed Contract" } })
      fireEvent.click(screen.getByRole("button", { name: /createContract/i }))
    })

    await waitFor(() => {
      expect(createContract).toHaveBeenCalled()
      expect(toast).toHaveBeenCalledWith({
        title: "error",
        description: "Failed to create contract.",
        variant: "destructive",
      })
    })
  })

  it("populates form fields correctly for editing", async () => {
    const initialData = {
      id: "contract123",
      contract_id: "C-001",
      contract_name: "Existing Contract",
      contract_type: "Sale",
      status: "Active",
      party_a_id: "party1",
      party_b_id: "party2",
      promoter_id: "promoter1",
      effective_date: "2023-01-01T00:00:00.000Z",
      termination_date: "2024-01-01T00:00:00.000Z",
      contract_value: 5000,
      payment_terms: "Upon delivery",
      content_english: "Existing English content.",
      content_spanish: "Existing Spanish content.",
      is_template: false,
      is_archived: false,
      created_at: "2022-12-01T00:00:00.000Z",
      updated_at: "2022-12-01T00:00:00.000Z",
      parties_a: { id: "party1", name: "Party A" },
      parties_b: { id: "party2", name: "Party B" },
      promoters: { id: "promoter1", name: "Promoter X" },
    }

    renderWithProviders(
      <ContractGeneratorForm parties={mockParties} promoters={mockPromoters} initialData={initialData} />,
    )

    expect(screen.getByLabelText(/contractName/i)).toHaveValue("Existing Contract")
    expect(screen.getByLabelText(/contractType/i)).toHaveValue("Sale")
    expect(screen.getByLabelText(/status/i)).toHaveValue("Active")
    expect(screen.getByRole("button", { name: "Party A" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Party B" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Promoter X" })).toBeInTheDocument()
    expect(screen.getByLabelText(/contractValue/i)).toHaveValue(5000)
    expect(screen.getByLabelText(/paymentTerms/i)).toHaveValue("Upon delivery")
    expect(screen.getByLabelText(/contentEnglish/i)).toHaveValue("Existing English content.")
    expect(screen.getByLabelText(/contentSpanish/i)).toHaveValue("Existing Spanish content.")
    expect(screen.getByRole("button", { name: /updateContract/i })).toBeInTheDocument()
  })

  it("submits the form successfully for editing", async () => {
    const { updateContract } = require("@/app/actions/contracts")
    const { toast } = require("@/components/ui/use-toast")
    const { useRouter } = require("next/navigation")

    const initialData = {
      id: "contract123",
      contract_id: "C-001",
      contract_name: "Existing Contract",
      contract_type: "Sale",
      status: "Active",
      party_a_id: "party1",
      party_b_id: "party2",
      promoter_id: "promoter1",
      effective_date: "2023-01-01T00:00:00.000Z",
      termination_date: "2024-01-01T00:00:00.000Z",
      contract_value: 5000,
      payment_terms: "Upon delivery",
      content_english: "Existing English content.",
      content_spanish: "Existing Spanish content.",
      is_template: false,
      is_archived: false,
      created_at: "2022-12-01T00:00:00.000Z",
      updated_at: "2022-12-01T00:00:00.000Z",
      parties_a: { id: "party1", name: "Party A" },
      parties_b: { id: "party2", name: "Party B" },
      promoters: { id: "promoter1", name: "Promoter X" },
    }

    renderWithProviders(
      <ContractGeneratorForm parties={mockParties} promoters={mockPromoters} initialData={initialData} />,
    )

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/contractName/i), { target: { value: "Updated Contract Success" } })
      fireEvent.click(screen.getByRole("button", { name: /updateContract/i }))
    })

    await waitFor(() => {
      expect(updateContract).toHaveBeenCalledWith(
        "contract123",
        expect.any(Object), // prevState
        expect.any(FormData),
      )
      expect(toast).toHaveBeenCalledWith({
        title: "success",
        description: "Contract updated successfully!",
      })
      expect(useRouter().push).toHaveBeenCalledWith("/contracts/contract123")
      expect(useRouter().refresh).toHaveBeenCalled()
    })
  })
})
