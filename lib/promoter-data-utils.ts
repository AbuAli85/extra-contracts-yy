import { Promoter } from './types'

/**
 * Utility functions for working with promoter data
 */

export interface PromoterCSVRow {
  id: string
  name_en: string
  name_ar: string
  id_card_number: string
  id_card_url: string | null
  passport_url: string | null
  employer_id: string | null
  outsourced_to_id: string | null
  job_title: string | null
  work_location: string | null
  status: string | null
  contract_valid_until: string | null
  id_card_expiry_date: string | null
  passport_expiry_date: string | null
  notify_days_before_id_expiry: number | null
  notify_days_before_passport_expiry: number | null
  notify_days_before_contract_expiry: number | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
}

/**
 * Parse CSV string into promoter data
 */
export function parsePromoterCSV(csvText: string): PromoterCSVRow[] {
  const lines = csvText.trim().split('\n')
  if (lines.length <= 1) {
    return []
  }

  const headers = lines[0].split(',').map(h => h.trim())
  const dataRows = lines.slice(1)

  return dataRows.map(line => {
    const values = line.split(',')
    const entry: any = {}
    
    headers.forEach((header, index) => {
      let value = values[index] ? values[index].trim() : ''
      
      // Handle quoted values
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      
      // Convert numeric fields
      if ([
        'notify_days_before_id_expiry',
        'notify_days_before_passport_expiry',
        'notify_days_before_contract_expiry'
      ].includes(header)) {
        entry[header] = value ? parseInt(value, 10) : null
      } else {
        entry[header] = value || null
      }
    })
    return entry as PromoterCSVRow
  })
}

/**
 * Analyze promoter data for summary statistics
 */
export function analyzePromoterData(promoters: PromoterCSVRow[]) {
  const totalPromoters = promoters.length
  const active = promoters.filter(p => p.status === 'active').length
  const inactive = promoters.filter(p => p.status !== 'active').length
  const withNotifications = promoters.filter(p =>
    p.notify_days_before_id_expiry ||
    p.notify_days_before_passport_expiry ||
    p.notify_days_before_contract_expiry
  ).length
  const withoutNotifications = totalPromoters - withNotifications
  return {
    totalPromoters,
    active,
    inactive,
    withNotifications,
    withoutNotifications
  }
}

/**
 * Download promoter data as CSV
 */
export function downloadPromoterCSV(promoters: PromoterCSVRow[]) {
  const headers = Object.keys(promoters[0] || {})
  const csv = [headers.join(',')]
  for (const row of promoters) {
    csv.push(headers.map(h => JSON.stringify((row as any)[h] ?? '')).join(','))
  }
  const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'promoters.csv'
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Validate a promoter row
 */
export function validatePromoterData(promoter: PromoterCSVRow) {
  const errors: string[] = []
  if (!promoter.name_en) errors.push('Name (EN) is required')
  if (!promoter.name_ar) errors.push('Name (AR) is required')
  if (!promoter.id_card_number) errors.push('ID Card Number is required')
  // Add more validation as needed
  // Validate notification days
  const notificationFields = [
    'notify_days_before_id_expiry',
    'notify_days_before_passport_expiry',
    'notify_days_before_contract_expiry'
  ]
  notificationFields.forEach((field) => {
    const value = promoter[field as keyof PromoterCSVRow]
    if (value !== null && (typeof value !== 'number' || value < 0)) {
      errors.push(`${field} must be a positive number`)
    }
  })
  return {
    isValid: errors.length === 0,
    errors
  }
}
