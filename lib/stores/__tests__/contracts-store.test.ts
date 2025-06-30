import { renderHook, act } from '@testing-library/react'
import { useContractsStore } from '../contracts-store'

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: [],
          error: null
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: null,
          error: null
        }))
      }))
    }))
  }))
}))

// Mock error handler
jest.mock('@/lib/error-handler', () => ({
  withRetry: jest.fn((fn) => fn()),
  logError: jest.fn(),
  getErrorMessage: jest.fn((error) => error.message || 'Unknown error')
}))

describe('useContractsStore', () => {
  beforeEach(() => {
    // Reset store state
    useContractsStore.setState({
      contracts: [],
      loading: false,
      error: null,
      statistics: {
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      }
    })
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useContractsStore())
    
    expect(result.current.contracts).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.statistics).toEqual({
      total: 0,
      pending: 0,
      completed: 0,
      failed: 0,
    })
  })

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useContractsStore())
    
    // Set an error first
    act(() => {
      useContractsStore.setState({ error: 'Test error' })
    })
    
    expect(result.current.error).toBe('Test error')
    
    // Clear the error
    act(() => {
      result.current.clearError()
    })
    
    expect(result.current.error).toBe(null)
  })

  it('should set loading state during fetchContracts', async () => {
    const { result } = renderHook(() => useContractsStore())
    
    act(() => {
      result.current.fetchContracts()
    })
    
    // Should set loading to true initially
    expect(result.current.loading).toBe(true)
    
    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    // Should set loading back to false
    expect(result.current.loading).toBe(false)
  })

  it('should update statistics correctly', () => {
    const { result } = renderHook(() => useContractsStore())
    
    const mockContracts = [
      { id: '1', status: 'completed', contract_number: '1', contract_name: 'Test 1', party_a: 'A', party_b: 'B', contract_type: 'test', terms: 'terms', created_at: '', updated_at: '' },
      { id: '2', status: 'pending', contract_number: '2', contract_name: 'Test 2', party_a: 'A', party_b: 'B', contract_type: 'test', terms: 'terms', created_at: '', updated_at: '' },
      { id: '3', status: 'generating', contract_number: '3', contract_name: 'Test 3', party_a: 'A', party_b: 'B', contract_type: 'test', terms: 'terms', created_at: '', updated_at: '' },
      { id: '4', status: 'failed', contract_number: '4', contract_name: 'Test 4', party_a: 'A', party_b: 'B', contract_type: 'test', terms: 'terms', created_at: '', updated_at: '' },
      { id: '5', status: 'completed', contract_number: '5', contract_name: 'Test 5', party_a: 'A', party_b: 'B', contract_type: 'test', terms: 'terms', created_at: '', updated_at: '' },
    ]
    
    act(() => {
      useContractsStore.setState({ contracts: mockContracts })
      result.current.updateStatistics()
    })
    
    expect(result.current.statistics).toEqual({
      total: 5,
      pending: 2, // pending + generating
      completed: 2,
      failed: 1,
    })
  })
})