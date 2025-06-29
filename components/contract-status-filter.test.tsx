import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ContractStatusFilter } from "./contract-status-filter"
import { NextIntlClientProvider } from "next-intl/client"
import messages from "@/messages/en.json" // Adjust path as necessary
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock next-intl useTranslations
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key, // Simple mock that returns the key
}))

const renderWithProviders = (ui: React.ReactElement, { locale = "en" } = {}) => {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  )
}

describe("ContractStatusFilter", () => {
  const mockOnFilterChange = jest.fn()
  const statuses = ["Draft", "Pending Review", "Active", "Completed", "Archived", "Terminated"]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders all status options", () => {
    renderWithProviders(
      <ContractStatusFilter selectedStatus="All" onFilterChange={mockOnFilterChange} statuses={statuses} />,
    )

    expect(screen.getByText("All")).toBeInTheDocument()
    statuses.forEach((status) => {
      expect(screen.getByText(status)).toBeInTheDocument()
    })
  })

  it("displays the currently selected status", () => {
    renderWithProviders(
      <ContractStatusFilter selectedStatus="Active" onFilterChange={mockOnFilterChange} statuses={statuses} />,
    )

    const selectTrigger = screen.getByRole("combobox")
    expect(selectTrigger).toHaveTextContent("Active")
  })

  it("calls onFilterChange when a new status is selected", () => {
    renderWithProviders(
      <ContractStatusFilter selectedStatus="All" onFilterChange={mockOnFilterChange} statuses={statuses} />,
    )

    fireEvent.mouseDown(screen.getByRole("combobox")) // Open the select
    fireEvent.click(screen.getByText("Completed")) // Click on a new status

    expect(mockOnFilterChange).toHaveBeenCalledWith("Completed")
  })

  it("handles 'All' status selection", () => {
    renderWithProviders(
      <ContractStatusFilter selectedStatus="Active" onFilterChange={mockOnFilterChange} statuses={statuses} />,
    )

    fireEvent.mouseDown(screen.getByRole("combobox"))
    fireEvent.click(screen.getByText("All"))

    expect(mockOnFilterChange).toHaveBeenCalledWith("All")
  })

  it("is disabled when disabled prop is true", () => {
    renderWithProviders(
      <ContractStatusFilter
        selectedStatus="All"
        onFilterChange={mockOnFilterChange}
        statuses={statuses}
        disabled={true}
      />,
    )

    expect(screen.getByRole("combobox")).toBeDisabled()
  })
})
