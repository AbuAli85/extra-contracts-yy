"use client"

import type React from "react"

import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useDeleteContractMutation } from "./use-contracts"
import { toast } from "@/components/ui/use-toast" // Assuming this is the correct path
import { useRouter } from "next/navigation"
import { NextIntlClientProvider } from "next-intl/client"
import messages from "@/messages/en.json" // Adjust path as necessary
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the server action
jest.mock("@/app/actions/contracts", () => ({
  deleteContract: jest.fn((id: string) => {
    if (id === "success-id") {
      return Promise.resolve({ success: true, message: "Contract deleted successfully!" })
    }
    return Promise.resolve({ success: false, message: "Failed to delete contract." })
  }),
}))

// Mock useToast
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}))

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}))

// Mock next-intl useTranslations
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key, // Simple mock that returns the key
}))

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </NextIntlClientProvider>
)

describe("useDeleteContractMutation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("successfully deletes a contract", async () => {
    const { result } = renderHook(() => useDeleteContractMutation(), { wrapper })

    result.current.mutate("success-id")

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(toast).toHaveBeenCalledWith({
      title: "success",
      description: "Contract deleted successfully!",
    })
    expect(useRouter().refresh).toHaveBeenCalled()
  })

  it("handles deletion error", async () => {
    const { result } = renderHook(() => useDeleteContractMutation(), { wrapper })

    result.current.mutate("error-id")

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast).toHaveBeenCalledWith({
      title: "error",
      description: "Failed to delete contract.",
      variant: "destructive",
    })
    expect(useRouter().refresh).not.toHaveBeenCalled()
  })
})
