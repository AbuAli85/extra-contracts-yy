import type React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  usePromoters,
  usePromoter,
  useCreatePromoterMutation,
  useUpdatePromoterMutation,
  useDeletePromoterMutation,
} from "./use-promoters"
import jest from "jest" // Import jest to declare it

// Mock Supabase client
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({ data: { id: "1", name: "Test Promoter" }, error: null })),
        })),
        order: jest.fn(() => ({
          data: [{ id: "1", name: "Test Promoter" }],
          error: null,
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({ data: { id: "2", name: "New Promoter" }, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ data: { id: "1", name: "Updated Promoter" }, error: null })),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
  })),
}))

describe("Promoter Hooks", () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  describe("usePromoters", () => {
    it("fetches promoters successfully", async () => {
      const { result } = renderHook(() => usePromoters(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual([{ id: "1", name: "Test Promoter" }])
    })
  })

  describe("usePromoter", () => {
    it("fetches a single promoter successfully", async () => {
      const { result } = renderHook(() => usePromoter("1"), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual({ id: "1", name: "Test Promoter" })
    })
  })

  describe("useCreatePromoterMutation", () => {
    it("creates a promoter successfully", async () => {
      const { result } = renderHook(() => useCreatePromoterMutation(), { wrapper })

      result.current.mutate({ name: "New Promoter", email: "new@example.com", phone: "555", company_name: "New Co" })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual({
        success: true,
        message: "Promoter created successfully!",
        data: { id: "2", name: "New Promoter" },
      })
    })
  })

  describe("useUpdatePromoterMutation", () => {
    it("updates a promoter successfully", async () => {
      const { result } = renderHook(() => useUpdatePromoterMutation(), { wrapper })

      result.current.mutate({ id: "1", name: "Updated Promoter" })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual({
        success: true,
        message: "Promoter updated successfully!",
        data: { id: "1", name: "Updated Promoter" },
      })
    })
  })

  describe("useDeletePromoterMutation", () => {
    it("deletes a promoter successfully", async () => {
      const { result } = renderHook(() => useDeletePromoterMutation(), { wrapper })

      result.current.mutate("1")

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual({ success: true, message: "Promoter deleted successfully!" })
    })
  })
})
