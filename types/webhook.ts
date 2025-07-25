export interface WebhookContractData {
  contract_id: string
  contract_number: string
  
  // FIRST PARTY = EMPLOYER (Post-swap)
  first_party_name_en: string
  first_party_name_ar: string
  first_party_crn: string
  
  // SECOND PARTY = CLIENT (Post-swap)
  second_party_name_en: string
  second_party_name_ar: string
  second_party_crn: string
  
  // PROMOTER DETAILS
  promoter_name_en: string
  promoter_name_ar: string
  job_title: string
  work_location: string
  email: string
  id_card_number: string
  
  // CONTRACT DATES
  start_date: string
  end_date: string
  
  // IMAGE URLS
  promoter_id_card_url: string
  promoter_passport_url: string
  
  // PDF URL (Generated by Make.com)
  pdf_url: string | null
}

export interface PartyRoleMapping {
  // Business Logic: Employer hires Promoter to serve Client
  FIRST_PARTY: 'EMPLOYER'   // Company that employs the promoter
  SECOND_PARTY: 'CLIENT'    // Company that receives services
  THIRD_PARTY: 'PROMOTER'   // Person providing the services
}
