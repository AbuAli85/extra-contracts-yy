import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePromoters } from './use-promoters'
import { toast } from 'sonner'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: jest.fn(() => '/en'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

const mockGetSession = jest.fn()
const mockOrder = jest.fn()
const mockSelect = jest.fn(() => ({ order: mockOrder }))
const mockFrom = jest.fn(() => ({ select: mockSelect }))
const mockChannel = jest.fn(() => ({
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnValue({}),
}))
const mockRemoveChannel = jest.fn()

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getSession: mockGetSession },
    from: mockFrom,
    channel: mockChannel,
    removeChannel: mockRemoveChannel,
  },
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient()
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('usePromoters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('redirects to /login when no session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockOrder.mockResolvedValue({ data: [], error: null })

    renderHook(() => usePromoters(), { wrapper })

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/login'))
    expect(toast.error).toHaveBeenCalled()
  })

  test('loads promoters when session exists', async () => {
    const promoters = [{ id: '1', name_en: 'P1', name_ar: 'AR', id_card_number: '123' }]
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
    mockOrder.mockResolvedValue({ data: promoters, error: null })

    const { result } = renderHook(() => usePromoters(), { wrapper })

    await waitFor(() => expect(result.current.data).toEqual(promoters))
  })
})
