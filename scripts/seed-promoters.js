const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ekdjxzhujettocosgzql.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZGp4emh1amV0dG9jb3NnenFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMTkxMDYsImV4cCI6MjA2NDg5NTEwNn0.6VGbocKFVLNX_MCIOwFtdEssMk6wd_UQ5yNT1CfV6BA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const testPromoters = [
  {
    name_en: "Ahmed Al-Rashid",
    name_ar: "أحمد الراشد",
    id_card_number: "1234567890",
    status: "active",
    id_card_expiry_date: "2025-12-31",
    passport_expiry_date: "2026-06-30",
    notify_days_before_id_expiry: 30,
    notify_days_before_passport_expiry: 90,
    notes: "Senior promoter with 5 years experience"
  },
  {
    name_en: "Fatima Al-Zahra",
    name_ar: "فاطمة الزهراء",
    id_card_number: "0987654321",
    status: "active",
    id_card_expiry_date: "2025-08-15",
    passport_expiry_date: "2027-03-20",
    notify_days_before_id_expiry: 30,
    notify_days_before_passport_expiry: 90,
    notes: "Specializes in luxury product promotion"
  },
  {
    name_en: "Omar Al-Hassan",
    name_ar: "عمر الحسن",
    id_card_number: "1122334455",
    status: "active",
    id_card_expiry_date: "2024-11-30",
    passport_expiry_date: "2025-09-15",
    notify_days_before_id_expiry: 30,
    notify_days_before_passport_expiry: 90,
    notes: "New promoter, requires training"
  },
  {
    name_en: "Aisha Al-Mahmoud",
    name_ar: "عائشة المحمود",
    id_card_number: "5566778899",
    status: "inactive",
    id_card_expiry_date: "2024-05-20",
    passport_expiry_date: "2025-02-10",
    notify_days_before_id_expiry: 30,
    notify_days_before_passport_expiry: 90,
    notes: "On leave until further notice"
  },
  {
    name_en: "Khalid Al-Saadi",
    name_ar: "خالد السعدي",
    id_card_number: "9988776655",
    status: "active",
    id_card_expiry_date: "2026-01-15",
    passport_expiry_date: "2028-07-22",
    notify_days_before_id_expiry: 30,
    notify_days_before_passport_expiry: 90,
    notes: "Team leader, excellent performance"
  }
]

async function seedPromoters() {
  console.log('Starting to seed promoters...')
  
  try {
    // First, check if promoters already exist
    const { data: existingPromoters, error: checkError } = await supabase
      .from('promoters')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.error('Error checking existing promoters:', checkError)
      return
    }
    
    if (existingPromoters && existingPromoters.length > 0) {
      console.log('Promoters already exist in database. Skipping seeding.')
      return
    }
    
    // Insert test promoters
    const { data: insertedPromoters, error: insertError } = await supabase
      .from('promoters')
      .insert(testPromoters)
      .select()
    
    if (insertError) {
      console.error('Error inserting promoters:', insertError)
      return
    }
    
    console.log(`Successfully inserted ${insertedPromoters.length} promoters:`)
    insertedPromoters.forEach(promoter => {
      console.log(`- ${promoter.name_en} (${promoter.id_card_number})`)
    })
    
  } catch (error) {
    console.error('Unexpected error during seeding:', error)
  }
}

// Run the seeding
seedPromoters()
