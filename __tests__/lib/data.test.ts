import { getContractsData, getContractById, getPartiesData, getPromotersData } from "@/lib/data"
import {
  mockSupabaseClient,
  mockContracts,
  mockParties,
  mockPromoters,
  createMockResponse,
  createMockError,
  resetSupabaseMocks,
  mockSupabaseError,
} from "@/__tests__/__mocks__/supabase"

// Mock the supabase clients
jest.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}))

jest.mock("@/lib/supabase/server", () => ({
  createClient: () => mockSupabaseClient,
}))

describe("Data Layer", () => {
  beforeEach(() => {
    resetSupabaseMocks()
    // Mock window to ensure browser client is used in tests
    Object.defineProperty(global, "window", {
      value: {},
      writable: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("getContractsData", () => {
    it("should fetch contracts successfully", async () => {
      const mockData = mockContracts.map(contract => ({
        ...contract,
        parties_contracts_party_a_id_fkey: { name: "Party A" },
        parties_contracts_party_b_id_fkey: { name: "Party B" },
        promoters: { name: "Promoter" },
      }))

      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(mockData))

      const result = await getContractsData()

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("contracts")
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        contract_name: "Test Contract 1",
        party_a_name: "Party A",
        party_b_name: "Party B",
        promoter_name: "Promoter",
      })
    })

    it("should apply search query filter", async () => {
      const mockData = [mockContracts[0]]
      mockSupabaseClient.from().or.mockReturnThis()
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(mockData))

      await getContractsData("test query")

      expect(mockSupabaseClient.from().or).toHaveBeenCalledWith(
        "contract_name.ilike.%test query%,contract_type.ilike.%test query%"
      )
    })

    it("should apply status filter", async () => {
      const mockData = [mockContracts[0]]
      mockSupabaseClient.from().eq.mockReturnThis()
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(mockData))

      await getContractsData(undefined, "Active")

      expect(mockSupabaseClient.from().eq).toHaveBeenCalledWith("status", "Active")
    })

    it("should not apply status filter for 'all'", async () => {
      const mockData = mockContracts
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(mockData))

      await getContractsData(undefined, "all")

      expect(mockSupabaseClient.from().eq).not.toHaveBeenCalled()
    })

    it("should handle errors gracefully", async () => {
      const error = createMockError("Database connection failed")
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(null, error))

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const result = await getContractsData()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching contracts:", error)
      
      consoleSpy.mockRestore()
    })

    it("should handle missing party/promoter names", async () => {
      const mockData = [{
        ...mockContracts[0],
        parties_contracts_party_a_id_fkey: null,
        parties_contracts_party_b_id_fkey: null,
        promoters: null,
      }]

      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(mockData))

      const result = await getContractsData()

      expect(result[0]).toMatchObject({
        party_a_name: "N/A",
        party_b_name: "N/A",
        promoter_name: "N/A",
      })
    })
  })

  describe("getContractById", () => {
    it("should fetch a specific contract", async () => {
      const mockData = {
        ...mockContracts[0],
        parties_contracts_party_a_id_fkey: { name: "Party A" },
        parties_contracts_party_b_id_fkey: { name: "Party B" },
        promoters: { name: "Promoter" },
      }

      mockSupabaseClient.from().single.mockResolvedValue(createMockResponse(mockData))

      const result = await getContractById("1")

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("contracts")
      expect(mockSupabaseClient.from().eq).toHaveBeenCalledWith("id", "1")
      expect(mockSupabaseClient.from().single).toHaveBeenCalled()
      expect(result).toMatchObject({
        id: "1",
        contract_name: "Test Contract 1",
        party_a_name: "Party A",
        party_b_name: "Party B",
        promoter_name: "Promoter",
      })
    })

    it("should return null for non-existent contract", async () => {
      const error = createMockError("No rows returned")
      mockSupabaseClient.from().single.mockResolvedValue(createMockResponse(null, error))

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const result = await getContractById("999")

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching contract:", error)
      
      consoleSpy.mockRestore()
    })

    it("should handle database errors", async () => {
      const error = createMockError("Database connection failed")
      mockSupabaseClient.from().single.mockResolvedValue(createMockResponse(null, error))

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const result = await getContractById("1")

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching contract:", error)
      
      consoleSpy.mockRestore()
    })
  })

  describe("getPartiesData", () => {
    it("should fetch parties successfully", async () => {
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(mockParties))

      const result = await getPartiesData()

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("parties")
      expect(result).toEqual(mockParties)
    })

    it("should apply search query filter", async () => {
      const filteredParties = [mockParties[0]]
      mockSupabaseClient.from().or.mockReturnThis()
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(filteredParties))

      await getPartiesData("Party One")

      expect(mockSupabaseClient.from().or).toHaveBeenCalledWith(
        "name.ilike.%Party One%,contact_email.ilike.%Party One%"
      )
    })

    it("should handle errors gracefully", async () => {
      const error = createMockError("Database connection failed")
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(null, error))

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const result = await getPartiesData()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching parties:", error)
      
      consoleSpy.mockRestore()
    })
  })

  describe("getPromotersData", () => {
    it("should fetch promoters successfully", async () => {
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(mockPromoters))

      const result = await getPromotersData()

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("promoters")
      expect(result).toEqual(mockPromoters)
    })

    it("should apply search query filter", async () => {
      const filteredPromoters = [mockPromoters[0]]
      mockSupabaseClient.from().or.mockReturnThis()
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(filteredPromoters))

      await getPromotersData("Alpha")

      expect(mockSupabaseClient.from().or).toHaveBeenCalledWith(
        "name.ilike.%Alpha%,email.ilike.%Alpha%,company.ilike.%Alpha%"
      )
    })

    it("should handle errors gracefully", async () => {
      const error = createMockError("Database connection failed")
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(null, error))

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const result = await getPromotersData()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching promoters:", error)
      
      consoleSpy.mockRestore()
    })
  })

  describe("Server vs Browser Client", () => {
    it("should use browser client when window is available", async () => {
      // window is already mocked in beforeEach
      
      // Reset mocks to verify the client is called
      resetSupabaseMocks()
      
      await getContractsData()
      
      // Verify that the client was used (any client call indicates it was instantiated)
      expect(mockSupabaseClient.from).toHaveBeenCalled()
    })

    it("should handle server environment gracefully", async () => {
      // Remove window to simulate server environment
      delete (global as any).window
      
      // Reset mocks
      resetSupabaseMocks()
      
      await getContractsData()
      
      // Should still work by falling back to browser client
      expect(mockSupabaseClient.from).toHaveBeenCalled()
    })
  })

  describe("Error Scenarios", () => {
    it("should handle network timeouts", async () => {
      const error = createMockError("Network timeout")
      mockSupabaseClient.from().select.mockResolvedValue(createMockResponse(null, error))

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const result = await getContractsData()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching contracts:", error)
      
      consoleSpy.mockRestore()
    })

    it("should handle malformed responses", async () => {
      // Simulate a response with unexpected structure
      mockSupabaseClient.from().select.mockResolvedValue({
        data: "invalid response format",
        error: null,
      })

      // This should not throw an error, but handle gracefully
      const result = await getContractsData()

      // The function should handle the malformed response
      expect(result).toBeDefined()
    })
  })
})