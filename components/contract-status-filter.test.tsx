"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { ContractStatusFilter } from "./contract-status-filter"
import jest from "jest"

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

describe("ContractStatusFilter", () => {
  it("shows all status options when opened", () => {
    render(<ContractStatusFilter />)

    fireEvent.click(screen.getByRole("button"))

    const statuses = [
      /all/i,
      /Draft/i,
      /Pending Review/i,
      /Approved/i,
      /Signed/i,
      /Active/i,
      /Completed/i,
      /Archived/i,
    ]

    statuses.forEach((status) => {
      expect(screen.getByText(status)).toBeInTheDocument()
    })
  })
})
