import { render, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { usePromoters } from "@/hooks/use-promoters"

const pushMock = jest.fn()
const toastMock = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}))

const getSessionMock = jest.fn()

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { getSession: getSessionMock },
    from: jest.fn(),
    channel: jest.fn(() => ({ on: jest.fn().mockReturnThis(), subscribe: jest.fn(() => "chan") })),
    removeChannel: jest.fn(),
  },
}))

describe("usePromoters", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("redirects and shows toast when unauthenticated", async () => {
    getSessionMock.mockResolvedValue({ data: { session: null }, error: null })

    const queryClient = new QueryClient()

    const TestComponent = () => {
      usePromoters()
      return null
    }

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login")
    })
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "destructive" }),
    )
  })
})
