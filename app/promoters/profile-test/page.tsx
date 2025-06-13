// This is a test page to render the form.
// You can navigate to /promoters/profile-test to see the form.
// In a real app, this form would be part of /promoters/new or /promoters/[id]/edit pages.
"use client"

import PromoterProfileForm from "@/components/promoter-profile-form"
import type { PromoterProfile } from "@/lib/types"

// Sample data for editing (optional)
const samplePromoterToEdit: PromoterProfile = {
  id: "promo-123",
  name_en: "Jane Smith",
  name_ar: "جين سميث",
  id_card_number: "9876543210",
  employer_id: "beta_workforce",
  outsourced_to_id: "client_tech_innovators",
  job_title: "Senior Promoter",
  work_location: "Tech Park, Building A",
  status: "active",
  contract_valid_until: "2025-12-31",
  id_card_url: "/placeholder.svg?width=300&height=200",
  passport_url: "/placeholder.svg?width=300&height=200",
  id_card_expiry_date: "2026-06-15",
  passport_expiry_date: "2028-03-20",
  notes: "Excellent performance. Key contact for Tech Innovators project.",
  created_at: "2023-01-10T10:00:00Z",
}

export default function PromoterProfileTestPage() {
  const handleFormSubmit = (data: any) => {
    console.log("Form submitted on test page:", data)
    // You can add navigation or other actions here
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <PromoterProfileForm
        // promoterToEdit={samplePromoterToEdit} // Uncomment to test edit mode
        onFormSubmitSuccess={handleFormSubmit}
      />
    </div>
  )
}
