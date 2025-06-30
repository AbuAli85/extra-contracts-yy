import { describe, it, expect } from '@jest/globals'
import { 
  partyFormSchema, 
  companyPartySchema, 
  individualPartySchema,
  isCompanyParty,
  isIndividualParty 
} from '../party'

describe('Party Validation Schemas', () => {
  describe('Company Party Schema', () => {
    it('should validate a correct company party', () => {
      const validCompany = {
        name_en: 'ACME Corporation',
        name_ar: 'شركة أكمي',
        email: 'contact@acme.com',
        phone: '+1-555-0123',
        address_en: '123 Business St',
        address_ar: 'شارع الأعمال 123',
        type: 'company' as const,
        company_registration: 'REG123456',
        legal_representative: 'John Doe',
        tax_id: 'TAX123456'
      }

      const result = companyPartySchema.safeParse(validCompany)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('company')
        expect(result.data.company_registration).toBe('REG123456')
      }
    })

    it('should reject company party without required fields', () => {
      const invalidCompany = {
        name_en: 'ACME Corporation',
        email: 'contact@acme.com',
        type: 'company' as const,
        // Missing name_ar, company_registration, legal_representative
      }

      const result = companyPartySchema.safeParse(invalidCompany)
      expect(result.success).toBe(false)
    })
  })

  describe('Individual Party Schema', () => {
    it('should validate a correct individual party', () => {
      const validIndividual = {
        name_en: 'Jane Smith',
        name_ar: 'جين سميث',
        email: 'jane@example.com',
        phone: '+1-555-0456',
        type: 'individual' as const,
        id_card_number: 'ID123456789',
        nationality: 'US',
        passport_number: 'P123456789'
      }

      const result = individualPartySchema.safeParse(validIndividual)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('individual')
        expect(result.data.id_card_number).toBe('ID123456789')
      }
    })

    it('should reject individual party without required fields', () => {
      const invalidIndividual = {
        name_en: 'Jane Smith',
        email: 'jane@example.com',
        type: 'individual' as const,
        // Missing name_ar, id_card_number, nationality
      }

      const result = individualPartySchema.safeParse(invalidIndividual)
      expect(result.success).toBe(false)
    })
  })

  describe('Discriminated Union', () => {
    it('should validate using discriminated union', () => {
      const companyData = {
        name_en: 'Tech Corp',
        name_ar: 'شركة التقنية',
        email: 'info@techcorp.com',
        type: 'company' as const,
        company_registration: 'TECH001',
        legal_representative: 'Alice Johnson'
      }

      const result = partyFormSchema.safeParse(companyData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(isCompanyParty(result.data)).toBe(true)
        expect(isIndividualParty(result.data)).toBe(false)
      }
    })
  })

  describe('Email validation', () => {
    it('should reject invalid email formats', () => {
      const invalidEmailParty = {
        name_en: 'Test User',
        name_ar: 'مستخدم تجريبي',
        email: 'invalid-email',
        type: 'individual' as const,
        id_card_number: 'ID123',
        nationality: 'US'
      }

      const result = partyFormSchema.safeParse(invalidEmailParty)
      expect(result.success).toBe(false)
    })
  })

  describe('Phone validation', () => {
    it('should accept valid phone formats', () => {
      const phoneFormats = [
        '+1-555-0123',
        '(555) 123-4567',
        '+44 20 7946 0958',
        '555.123.4567'
      ]

      phoneFormats.forEach(phone => {
        const partyData = {
          name_en: 'Test User',
          name_ar: 'مستخدم تجريبي',
          email: 'test@example.com',
          phone,
          type: 'individual' as const,
          id_card_number: 'ID123',
          nationality: 'US'
        }

        const result = partyFormSchema.safeParse(partyData)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid phone formats', () => {
      const invalidPhone = '123'

      const partyData = {
        name_en: 'Test User',
        name_ar: 'مستخدم تجريبي',
        email: 'test@example.com',
        phone: invalidPhone,
        type: 'individual' as const,
        id_card_number: 'ID123',
        nationality: 'US'
      }

      const result = partyFormSchema.safeParse(partyData)
      expect(result.success).toBe(false)
    })
  })
})