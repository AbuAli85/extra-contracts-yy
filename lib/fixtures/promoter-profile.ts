import type { Promoter } from "../types"

export const mockPromoterProfile: Promoter = {
  id: "promoter-123",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: "user-abc",
  name: "Global Events Inc.",
  email: "contact@globalevents.com",
  phone: "+1 (555) 123-4567",
  company_name: "Global Events Inc.",
  company_address: "123 Event Plaza, Metropolis, CA 90210",
  contact_person: "Alice Wonderland",
  contact_email: "alice@globalevents.com",
  contact_phone: "+1 (555) 987-6543",
  website: "https://www.globalevents.com",
  notes: "Key partner for large-scale international music festivals. Requires contracts in both English and Spanish.",
  logo_url: "https://example.com/global-events-logo.png",
}

export const sampleEmployers = [
  { value: "employer-1", label: "Acme Corp" },
  { value: "employer-2", label: "Globex Inc." },
  { value: "employer-3", label: "Soylent Corp" },
]

export const sampleClients = [
  { value: "client-1", label: "Client A" },
  { value: "client-2", label: "Client B" },
  { value: "client-3", label: "Client C" },
]

export const promoterStatuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
  { value: "terminated", label: "Terminated" },
]
