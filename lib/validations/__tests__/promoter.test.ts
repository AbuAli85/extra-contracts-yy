import { describe, it, expect } from '@jest/globals'
import { 
  promoterCreateSchema, 
  promoterUpdateSchema,
  validatePromoterImages,
  isPromoterActive 
} from '../promoter'

// Mock File for testing
class MockFile {
  constructor(public name: string, public size: number, public type: string) {}
}

global.File = MockFile as any

describe('Promoter Validation Schemas', () => {
  describe('Promoter Create Schema', () => {
    it('should validate a correct promoter', () => {
      const validPromoter = {
        name_en: 'John Promoter',
        name_ar: 'جون المروج',
        id_card_number: 'ID123456789',
        email: 'john@example.com',
        phone: '+1-555-0123',
        status: 'active' as const,
        job_title: 'Event Promoter',
        work_location: 'New York',
        bio: 'Experienced event promoter'
      }

      const result = promoterCreateSchema.safeParse(validPromoter)
      expect(result.success).toBe(true)
    })

    it('should reject promoter without required fields', () => {
      const invalidPromoter = {
        name_en: 'John Promoter',
        // Missing name_ar, id_card_number, email, status
      }

      const result = promoterCreateSchema.safeParse(invalidPromoter)
      expect(result.success).toBe(false)
    })

    it('should accept valid status values', () => {
      const statuses = ['active', 'inactive', 'suspended'] as const

      statuses.forEach(status => {
        const promoterData = {
          name_en: 'Test Promoter',
          name_ar: 'مروج تجريبي',
          id_card_number: 'ID123',
          email: 'test@example.com',
          status
        }

        const result = promoterCreateSchema.safeParse(promoterData)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid status values', () => {
      const promoterData = {
        name_en: 'Test Promoter',
        name_ar: 'مروج تجريبي',
        id_card_number: 'ID123',
        email: 'test@example.com',
        status: 'invalid-status'
      }

      const result = promoterCreateSchema.safeParse(promoterData)
      expect(result.success).toBe(false)
    })
  })

  describe('Promoter Update Schema', () => {
    it('should validate partial updates', () => {
      const updateData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name_en: 'Updated Name',
        email: 'updated@example.com'
        // Other fields are optional
      }

      const result = promoterUpdateSchema.safeParse(updateData)
      expect(result.success).toBe(true)
    })

    it('should require valid UUID for id', () => {
      const updateData = {
        id: 'invalid-id',
        name_en: 'Updated Name'
      }

      const result = promoterUpdateSchema.safeParse(updateData)
      expect(result.success).toBe(false)
    })
  })

  describe('Email validation', () => {
    it('should reject invalid email formats', () => {
      const invalidEmailPromoter = {
        name_en: 'Test Promoter',
        name_ar: 'مروج تجريبي',
        id_card_number: 'ID123',
        email: 'invalid-email',
        status: 'active' as const
      }

      const result = promoterCreateSchema.safeParse(invalidEmailPromoter)
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
        const promoterData = {
          name_en: 'Test Promoter',
          name_ar: 'مروج تجريبي',
          id_card_number: 'ID123',
          email: 'test@example.com',
          status: 'active' as const,
          phone
        }

        const result = promoterCreateSchema.safeParse(promoterData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Website validation', () => {
    it('should accept valid URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://test.org',
        'https://subdomain.example.com/path'
      ]

      validUrls.forEach(website => {
        const promoterData = {
          name_en: 'Test Promoter',
          name_ar: 'مروج تجريبي',
          id_card_number: 'ID123',
          email: 'test@example.com',
          status: 'active' as const,
          website
        }

        const result = promoterCreateSchema.safeParse(promoterData)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid URLs', () => {
      const promoterData = {
        name_en: 'Test Promoter',
        name_ar: 'مروج تجريبي',
        id_card_number: 'ID123',
        email: 'test@example.com',
        status: 'active' as const,
        website: 'not-a-url'
      }

      const result = promoterCreateSchema.safeParse(promoterData)
      expect(result.success).toBe(false)
    })
  })
})

describe('Promoter Utility Functions', () => {
  describe('validatePromoterImages', () => {
    it('should return errors for oversized images', () => {
      const oversizedFile = new MockFile('test.jpg', 6 * 1024 * 1024, 'image/jpeg') // 6MB
      
      const promoterData = {
        name_en: 'Test',
        name_ar: 'تجريبي',
        id_card_number: 'ID123',
        email: 'test@example.com',
        status: 'active' as const,
        id_card_image: oversizedFile as File
      }

      const errors = validatePromoterImages(promoterData)
      expect(errors).toContain('ID card image must be less than 5MB')
    })

    it('should return no errors for valid images', () => {
      const validFile = new MockFile('test.jpg', 1 * 1024 * 1024, 'image/jpeg') // 1MB
      
      const promoterData = {
        name_en: 'Test',
        name_ar: 'تجريبي',
        id_card_number: 'ID123',
        email: 'test@example.com',
        status: 'active' as const,
        id_card_image: validFile as File
      }

      const errors = validatePromoterImages(promoterData)
      expect(errors).toHaveLength(0)
    })
  })

  describe('isPromoterActive', () => {
    it('should return true for active promoter with valid contract', () => {
      const promoter = {
        status: 'active',
        contract_valid_until: new Date(Date.now() + 86400000) // Tomorrow
      }

      expect(isPromoterActive(promoter)).toBe(true)
    })

    it('should return false for inactive promoter', () => {
      const promoter = {
        status: 'inactive',
        contract_valid_until: new Date(Date.now() + 86400000) // Tomorrow
      }

      expect(isPromoterActive(promoter)).toBe(false)
    })

    it('should return false for promoter with expired contract', () => {
      const promoter = {
        status: 'active',
        contract_valid_until: new Date(Date.now() - 86400000) // Yesterday
      }

      expect(isPromoterActive(promoter)).toBe(false)
    })

    it('should return true for active promoter without contract expiry', () => {
      const promoter = {
        status: 'active',
        contract_valid_until: null
      }

      expect(isPromoterActive(promoter)).toBe(true)
    })
  })
})