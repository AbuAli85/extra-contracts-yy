import { screen, fireEvent } from "@testing-library/react"
import { ContractStatusFilter } from "./contract-status-filter"
import { renderWithProviders } from "@/__tests__/test-utils"
import { jest } from "@jest/globals" // Import jest globals

describe("ContractStatusFilter", () => {
  it('renders the dropdown menu with default "Filter by Status" text', () => {
    const mockOnSelectStatus = jest.fn()
    renderWithProviders(<ContractStatusFilter onSelectStatus={mockOnSelectStatus} />)

    expect(screen.getByRole("button", { name: /Filter by Status/i })).toBeInTheDocument()
  })

  it("displays all status options when opened", async () => {
    const mockOnSelectStatus = jest.fn()
    renderWithProviders(<ContractStatusFilter onSelectStatus={mockOnSelectStatus} />)

    fireEvent.click(screen.getByRole("button", { name: /Filter by Status/i }))

    expect(screen.getByText("All")).toBeInTheDocument()
    expect(screen.getByText("Draft")).toBeInTheDocument()
    expect(screen.getByText("Pending Review")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()
    expect(screen.getByText("Terminated")).toBeInTheDocument()
  })

  it("calls onSelectStatus with the correct value when an option is clicked", () => {
    const mockOnSelectStatus = jest.fn()
    renderWithProviders(<ContractStatusFilter onSelectStatus={mockOnSelectStatus} />)

    fireEvent.click(screen.getByRole("button", { name: /Filter by Status/i }))
    fireEvent.click(screen.getByText("Active"))

    expect(mockOnSelectStatus).toHaveBeenCalledWith("Active")
  })

  it("updates the button text to the selected status", () => {
    const mockOnSelectStatus = jest.fn()
    const { rerender } = renderWithProviders(<ContractStatusFilter onSelectStatus={mockOnSelectStatus} />)

    fireEvent.click(screen.getByRole("button", { name: /Filter by Status/i }))
    fireEvent.click(screen.getByText("Active"))

    rerender(<ContractStatusFilter onSelectStatus={mockOnSelectStatus} selectedStatus="Active" />)

    expect(screen.getByRole("button", { name: /Active/i })).toBeInTheDocument()
  })
})
