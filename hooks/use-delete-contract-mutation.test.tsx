import type React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useDeleteContractMutation } from "./use-contracts"
import { deleteContract as deleteContractAction } from "@/app/actions/contracts"
import jest from "jest" // Declare the jest variable

// Mock the server action
jest.mock("@/app/actions/contracts", () => ({
  deleteContract: jest.fn(),
}))

describe("useDeleteContractMutation", () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    ;(deleteContractAction as jest.Mock).mockClear()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it("successfully deletes a contract", async () => {
    ;(deleteContractAction as jest.Mock).mockResolvedValue({ success: true, message: "Deleted" })

    const { result } = renderHook(() => useDeleteContractMutation(), { wrapper })

    result.current.mutate("contract-id-1")

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(deleteContractAction).toHaveBeenCalledWith("contract-id-1")
  })

  it("handles deletion error", async () => {
    const errorMessage = "Failed to delete"
    ;(deleteContractAction as jest.Mock).mockResolvedValue({ success: false, message: errorMessage })

    const { result } = renderHook(() => useDeleteContractMutation(), { wrapper })

    result.current.mutate("contract-id-1")

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe(errorMessage)
    expect(deleteContractAction).toHaveBeenCalledWith("contract-id-1")
  })
})
