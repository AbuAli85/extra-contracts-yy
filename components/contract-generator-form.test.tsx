import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ContractGeneratorForm from './contract-generator-form'

// Simplified UI component mocks for easier testing
jest.mock('@/components/ui/select', () => {
  const React = require('react')
  return {
    Select: ({ children, value, onValueChange }: any) => (
      <select value={value} onChange={(e) => onValueChange?.(e.target.value)}>
        {children}
      </select>
    ),
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: ({ placeholder }: any) => <option value="">{placeholder}</option>,
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  }
})

jest.mock('@/components/combobox-field', () => {
  const React = require('react')
  return (props: any) => (
    <select
      aria-label="Promoter"
      value={props.field.value || ''}
      onChange={(e) => props.field.onChange(e.target.value)}
      disabled={props.disabled}
    >
      <option value="" disabled>
        {props.placeholder}
      </option>
      {props.options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
})

jest.mock('@/components/date-picker-with-manual-input', () => {
  const React = require('react')
  return {
    DatePickerWithManualInput: ({ setDate, ...rest }: any) => (
      <input
        type="text"
        onChange={(e) => setDate && setDate(new Date(e.target.value))}
        {...rest}
      />
    ),
  }
})

// Mock data hooks
jest.mock('@/hooks/use-parties', () => ({
  useParties: (type: 'Employer' | 'Client') => ({
    data:
      type === 'Employer'
        ? [{ id: 'employer-1', name_en: 'Employer EN', name_ar: 'Emp AR', crn: '', type: 'Employer' }]
        : [{ id: 'client-1', name_en: 'Client EN', name_ar: 'Client AR', crn: '', type: 'Client' }],
    isLoading: false,
    error: undefined,
  }),
}))

jest.mock('@/hooks/use-promoters', () => ({
  usePromoters: () => ({
    data: [
      {
        id: 'promoter-1',
        name_en: 'Promoter EN',
        name_ar: 'Promoter AR',
        id_card_number: 'ID123',
      },
    ],
    isLoading: false,
  }),
}))

const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ contract: { id: '1', pdf_url: 'url' } }),
  }),
) as jest.Mock

global.fetch = mockFetch

function renderForm() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <ContractGeneratorForm />
    </QueryClientProvider>,
  )
}

describe('ContractGeneratorForm', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders form fields', () => {
    renderForm()

    expect(screen.getByLabelText(/Party A/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Party B/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Promoter/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contract Start Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contract End Date/i)).toBeInTheDocument()
  })

  it('shows validation messages when submitting empty form', async () => {
    renderForm()

    await userEvent.click(
      screen.getByRole('button', { name: /generate & save contract/i }),
    )

    expect(await screen.findByText(/Please select Party A/i)).toBeInTheDocument()
    expect(await screen.findByText(/Please select Party B/i)).toBeInTheDocument()
    expect(await screen.findByText(/Please select a Promoter/i)).toBeInTheDocument()
    expect(
      await screen.findByText(/Contract start date is required/i),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/Contract end date is required/i),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/Please enter a valid email address/i),
    ).toBeInTheDocument()
  })

  it('submits data when form is valid', async () => {
    renderForm()

    userEvent.selectOptions(screen.getByLabelText(/Party A/i), 'employer-1')
    userEvent.selectOptions(screen.getByLabelText(/Party B/i), 'client-1')
    userEvent.selectOptions(screen.getByLabelText(/Promoter/i), 'promoter-1')

    userEvent.type(screen.getByLabelText(/Contract Start Date/i), '01-01-2024')
    userEvent.type(screen.getByLabelText(/Contract End Date/i), '02-01-2024')
    userEvent.type(screen.getByLabelText(/Notification Email/i), 'test@example.com')

    await userEvent.click(
      screen.getByRole('button', { name: /generate & save contract/i }),
    )

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/contracts',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
