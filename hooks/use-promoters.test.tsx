"use client"

import type React from "react"

import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  usePromoters,
  useCreatePromoterMutation,
  useUpdatePromoterMutation,
  useDeletePromoterMutation,
} from "./use-promoters"
import { toast } from "@/components/ui/use-toast" // Assuming this is the correct path
import { useRouter } from "next/navigation"
import { NextIntlClientProvider } from "next-intl/client"
import messages from "@/messages/en.json" // Adjust path as necessary
import { jest } from "@jest/globals" // Import jest globals

// Mock the server actions
jest.mock("@/app/actions/promoters", () => ({
  getPromoters: jest.fn(() => Promise.resolve({ data: [{ id: "1", name: "Test Promoter" }], success: true })),
  createPromoter: jest.fn((_prevState, formData) => {
    const name = formData.get("name")
    if (name === "New Promoter Success") {
      return Promise.resolve({ success: true, message: "Promoter created successfully!" })
    }
    return Promise.resolve({ success: false, message: "Failed to create promoter." })
  }),
  updatePromoter: jest.fn((_id, _prevState, formData) => {
    const name = formData.get("name")
    if (name === "Updated Promoter Success") {
      return Promise.resolve({ success: true, message: "Promoter updated successfully!" })
    }
    return Promise.resolve({ success: false, message: "Failed to update promoter." })
  }),
  deletePromoter: jest.fn((id: string) => {
    if (id === "success-id") {
      return Promise.resolve({ success: true, message: "Promoter deleted successfully!" })
    }
    return Promise.resolve({ success: false, message: "Failed to delete promoter." })
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

describe("usePromoters", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("fetches promoters successfully", async () => {
    const { result } = renderHook(() => usePromoters(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([{ id: "1", name: "Test Promoter" }])
  })

  it("handles fetch error", async () => {
    const { getPromoters } = require("@/app/actions/promoters")
    getPromoters.mockImplementationOnce(() =>
      Promise.resolve({ data: null, error: new Error("Fetch failed"), success: false }),
    )

    const { result } = renderHook(() => usePromoters(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error?.message).toBe("Fetch failed")
  })
})

describe("useCreatePromoterMutation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("successfully creates a promoter", async () => {
    const { result } = renderHook(() => useCreatePromoterMutation(), { wrapper })
    const formData = new FormData()
    formData.append("name", "New Promoter Success")

    result.current.mutate(formData)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(toast).toHaveBeenCalledWith({
      title: "success",
      description: "Promoter created successfully!",
    })
    expect(useRouter().refresh).toHaveBeenCalled()
  })

  it("handles creation error", async () => {
    const { result } = renderHook(() => useCreatePromoterMutation(), { wrapper })
    const formData = new FormData()
    formData.append("name", "New Promoter Fail")

    result.current.mutate(formData)

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast).toHaveBeenCalledWith({
      title: "error",
      description: "Failed to create promoter.",
      variant: "destructive",
    })
    expect(useRouter().refresh).not.toHaveBeenCalled()
  })
})

describe("useUpdatePromoterMutation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("successfully updates a promoter", async () => {
    const { result } = renderHook(() => useUpdatePromoterMutation(), { wrapper })
    const formData = new FormData()
    formData.append("name", "Updated Promoter Success")

    result.current.mutate({ id: "promoter-id", formData })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(toast).toHaveBeenCalledWith({
      title: "success",
      description: "Promoter updated successfully!",
    })
    expect(useRouter().refresh).toHaveBeenCalled()
  })

  it("handles update error", async () => {
    const { result } = renderHook(() => useUpdatePromoterMutation(), { wrapper })
    const formData = new FormData()
    formData.append("name", "Updated Promoter Fail")

    result.current.mutate({ id: "promoter-id", formData })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast).toHaveBeenCalledWith({
      title: "error",
      description: "Failed to update promoter.",
      variant: "destructive",
    })
    expect(useRouter().refresh).not.toHaveBeenCalled()
  })
})

describe("useDeletePromoterMutation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("successfully deletes a promoter", async () => {
    const { result } = renderHook(() => useDeletePromoterMutation(), { wrapper })

    result.current.mutate("success-id")

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(toast).toHaveBeenCalledWith({
      title: "success",
      description: "Promoter deleted successfully!",
    })
    expect(useRouter().refresh).toHaveBeenCalled()
  })

  it("handles deletion error", async () => {
    const { result } = renderHook(() => useDeletePromoterMutation(), { wrapper })

    result.current.mutate("error-id")

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast).toHaveBeenCalledWith({
      title: "error",
      description: "Failed to delete promoter.",
      variant: "destructive",
    })
    expect(useRouter().refresh).not.toHaveBeenCalled()
  })
})
