import { renderHook, act } from "@testing-library/react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import {
  mockSupabaseClient,
  createMockResponse,
  createMockError,
  resetSupabaseMocks,
} from "@/__tests__/__mocks__/supabase"

// Mock the supabase client
jest.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}))

describe("Contracts Store", () => {
  beforeEach(() => {
    resetSupabaseMocks()
    // Reset store state
    useContractsStore.setState({
      contracts: [],
      loading: false,
      statistics: {
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("fetchContracts", () => {
    it("should fetch contracts successfully", async () => {
      const mockContracts = [
        {
          id: "1",
          contract_number: "CON-001",
          contract_name: "Test Contract 1",
          party_a: "Party A",
          party_b: "Party B",
          contract_type: "Service",
          terms: "Terms 1",
          status: "completed",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "2",
          contract_number: "CON-002",
          contract_name: "Test Contract 2",
          party_a: "Party C",
          party_b: "Party D",
          contract_type: "Sales",
          terms: "Terms 2",
          status: "pending",
          created_at: "2023-01-02T00:00:00Z",
          updated_at: "2023-01-02T00:00:00Z",
        },
      ]

      // Mock the full query chain
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue(createMockResponse(mockContracts)),
      }
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)

      const { result } = renderHook(() => useContractsStore())

      expect(result.current.loading).toBe(false)
      expect(result.current.contracts).toEqual([])

      await act(async () => {
        await result.current.fetchContracts()
      })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("contracts")
      expect(mockQueryBuilder.select).toHaveBeenCalledWith("*")
      expect(mockQueryBuilder.order).toHaveBeenCalledWith("created_at", { ascending: false })

      expect(result.current.loading).toBe(false)
      expect(result.current.contracts).toEqual(mockContracts)
    })

    it("should handle fetch errors gracefully", async () => {
      const error = createMockError("Failed to fetch contracts")
      
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue(createMockResponse(null, error)),
      }
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const { result } = renderHook(() => useContractsStore())

      await act(async () => {
        await result.current.fetchContracts()
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.contracts).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching contracts:", error)

      consoleSpy.mockRestore()
    })

    it("should set loading state correctly", async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockImplementation(() => {
          // Simulate a delay to test loading state
          return new Promise((resolve) => {
            setTimeout(() => resolve(createMockResponse([])), 100)
          })
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)

      const { result } = renderHook(() => useContractsStore())

      expect(result.current.loading).toBe(false)

      const fetchPromise = act(async () => {
        await result.current.fetchContracts()
      })

      // Check that loading is set to true during fetch
      expect(result.current.loading).toBe(true)

      await fetchPromise

      // Check that loading is set back to false after fetch
      expect(result.current.loading).toBe(false)
    })
  })

  describe("generateContract", () => {
    it("should generate a new contract successfully", async () => {
      const newContractData = {
        contract_name: "New Test Contract",
        party_a: "New Party A",
        party_b: "New Party B",
        contract_type: "Service",
        terms: "New terms",
        pdf_url: "https://example.com/contract.pdf",
      }

      const mockGeneratedContract = {
        id: "new-id",
        contract_number: "CON-003",
        status: "pending",
        created_at: "2023-01-03T00:00:00Z",
        updated_at: "2023-01-03T00:00:00Z",
        ...newContractData,
      }

      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(createMockResponse([mockGeneratedContract])),
      }
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)

      const { result } = renderHook(() => useContractsStore())

      await act(async () => {
        await result.current.generateContract(newContractData)
      })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("contracts")
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
        ...newContractData,
        status: "pending",
      })
      expect(mockQueryBuilder.select).toHaveBeenCalled()

      expect(result.current.contracts).toContainEqual(mockGeneratedContract)
    })

    it("should handle generation errors", async () => {
      const newContractData = {
        contract_name: "New Test Contract",
        party_a: "New Party A",
        party_b: "New Party B",
        contract_type: "Service",
        terms: "New terms",
      }

      const error = createMockError("Failed to generate contract")
      
      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(createMockResponse(null, error)),
      }
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const { result } = renderHook(() => useContractsStore())

      await act(async () => {
        await result.current.generateContract(newContractData)
      })

      expect(consoleSpy).toHaveBeenCalledWith("Error generating contract:", error)
      expect(result.current.contracts).toEqual([])

      consoleSpy.mockRestore()
    })
  })

  describe("updateStatistics", () => {
    it("should calculate statistics from current contracts", async () => {
      const mockContracts = [
        { id: "1", status: "completed" },
        { id: "2", status: "pending" },
        { id: "3", status: "completed" },
        { id: "4", status: "failed" },
        { id: "5", status: "pending" },
      ]

      // Set initial contracts in the store
      useContractsStore.setState({ contracts: mockContracts as any })

      const { result } = renderHook(() => useContractsStore())

      await act(async () => {
        await result.current.updateStatistics()
      })

      expect(result.current.statistics).toEqual({
        total: 5,
        pending: 2,
        completed: 2,
        failed: 1,
      })
    })

    it("should handle empty contracts array", async () => {
      useContractsStore.setState({ contracts: [] })

      const { result } = renderHook(() => useContractsStore())

      await act(async () => {
        await result.current.updateStatistics()
      })

      expect(result.current.statistics).toEqual({
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      })
    })
  })

  describe("retryContract", () => {
    it("should retry a failed contract", async () => {
      const contractId = "test-id"
      const updatedContract = {
        id: contractId,
        status: "pending",
        updated_at: "2023-01-03T00:00:00Z",
      }

      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(createMockResponse([updatedContract])),
      }
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)

      // Set initial contract in the store
      useContractsStore.setState({
        contracts: [{ id: contractId, status: "failed" } as any],
      })

      const { result } = renderHook(() => useContractsStore())

      await act(async () => {
        await result.current.retryContract(contractId)
      })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("contracts")
      expect(mockQueryBuilder.update).toHaveBeenCalledWith({ status: "pending" })
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("id", contractId)
      expect(mockQueryBuilder.select).toHaveBeenCalled()

      // Check that the contract in the store was updated
      const updatedContractInStore = result.current.contracts.find(c => c.id === contractId)
      expect(updatedContractInStore?.status).toBe("pending")
    })

    it("should handle retry errors", async () => {
      const contractId = "test-id"
      const error = createMockError("Failed to retry contract")
      
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(createMockResponse(null, error)),
      }
      mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const { result } = renderHook(() => useContractsStore())

      await act(async () => {
        await result.current.retryContract(contractId)
      })

      expect(consoleSpy).toHaveBeenCalledWith("Error retrying contract:", error)

      consoleSpy.mockRestore()
    })
  })

  describe("Store State Management", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useContractsStore())

      expect(result.current.contracts).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.statistics).toEqual({
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      })
    })

    it("should allow direct state updates", () => {
      const { result } = renderHook(() => useContractsStore())

      const testContracts = [
        { id: "1", contract_name: "Test" } as any,
      ]

      act(() => {
        useContractsStore.setState({ contracts: testContracts })
      })

      expect(result.current.contracts).toEqual(testContracts)
    })
  })
})