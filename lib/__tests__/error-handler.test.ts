import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { 
  AppError,
  isAppError,
  getErrorMessage,
  logError,
  withErrorHandling,
  withRetry,
  handleAsyncError
} from '../error-handler'

// Mock console.error
const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

describe('Error Handler Utilities', () => {
  beforeEach(() => {
    consoleSpy.mockClear()
  })

  describe('AppError', () => {
    it('should create error with correct properties', () => {
      const error = new AppError('Test error', 'TEST_CODE', 400, { extra: 'data' })
      
      expect(error.message).toBe('Test error')
      expect(error.code).toBe('TEST_CODE')
      expect(error.statusCode).toBe(400)
      expect(error.context).toEqual({ extra: 'data' })
      expect(error.name).toBe('AppError')
    })
  })

  describe('isAppError', () => {
    it('should return true for AppError instances', () => {
      const error = new AppError('Test error')
      expect(isAppError(error)).toBe(true)
    })

    it('should return false for regular errors', () => {
      const error = new Error('Regular error')
      expect(isAppError(error)).toBe(false)
    })

    it('should return false for non-error values', () => {
      expect(isAppError('string')).toBe(false)
      expect(isAppError(null)).toBe(false)
      expect(isAppError(undefined)).toBe(false)
    })
  })

  describe('getErrorMessage', () => {
    it('should extract message from AppError', () => {
      const error = new AppError('App error message')
      expect(getErrorMessage(error)).toBe('App error message')
    })

    it('should extract message from regular Error', () => {
      const error = new Error('Regular error message')
      expect(getErrorMessage(error)).toBe('Regular error message')
    })

    it('should return string as-is', () => {
      expect(getErrorMessage('String error')).toBe('String error')
    })

    it('should return default message for unknown error types', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred')
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred')
      expect(getErrorMessage({})).toBe('An unexpected error occurred')
    })
  })

  describe('logError', () => {
    it('should log error with context', () => {
      const error = new Error('Test error')
      const context = { userId: '123', action: 'test' }
      
      logError(error, context)
      
      expect(consoleSpy).toHaveBeenCalledWith('Error:', expect.objectContaining({
        message: 'Test error',
        error,
        context,
        timestamp: expect.any(String)
      }))
    })

    it('should log error without context', () => {
      const error = new Error('Test error')
      
      logError(error)
      
      expect(consoleSpy).toHaveBeenCalledWith('Error:', expect.objectContaining({
        message: 'Test error',
        error,
        context: undefined,
        timestamp: expect.any(String)
      }))
    })
  })

  describe('withErrorHandling', () => {
    it('should return successful result', async () => {
      const fn = jest.fn().mockResolvedValue('success')
      
      const result = await withErrorHandling(fn)
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalled()
    })

    it('should wrap and re-throw errors', async () => {
      const originalError = new Error('Original error')
      const fn = jest.fn().mockRejectedValue(originalError)
      
      await expect(withErrorHandling(fn, 'Custom message')).rejects.toThrow(AppError)
      
      try {
        await withErrorHandling(fn, 'Custom message')
      } catch (error) {
        expect(isAppError(error)).toBe(true)
        if (isAppError(error)) {
          expect(error.message).toBe('Custom message')
          expect(error.context?.originalError).toBe(originalError)
        }
      }
    })

    it('should use error message when no custom message provided', async () => {
      const originalError = new Error('Original error message')
      const fn = jest.fn().mockRejectedValue(originalError)
      
      try {
        await withErrorHandling(fn)
      } catch (error) {
        expect(isAppError(error)).toBe(true)
        if (isAppError(error)) {
          expect(error.message).toBe('Original error message')
        }
      }
    })
  })

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = jest.fn().mockResolvedValue('success')
      
      const result = await withRetry(fn, 3, 100)
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('Attempt 1'))
        .mockRejectedValueOnce(new Error('Attempt 2'))
        .mockResolvedValueOnce('success')
      
      const result = await withRetry(fn, 3, 10) // Short delay for testing
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should fail after max retries', async () => {
      const error = new Error('Persistent error')
      const fn = jest.fn().mockRejectedValue(error)
      
      await expect(withRetry(fn, 2, 10)).rejects.toThrow('Persistent error')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should use exponential backoff', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('Attempt 1'))
        .mockRejectedValueOnce(new Error('Attempt 2'))
        .mockResolvedValueOnce('success')
      
      const startTime = Date.now()
      await withRetry(fn, 3, 100, 2) // 100ms base delay, 2x multiplier
      const endTime = Date.now()
      
      // Should take at least 100ms (first retry) + 200ms (second retry) = 300ms
      expect(endTime - startTime).toBeGreaterThan(200) // Allow some margin
      expect(fn).toHaveBeenCalledTimes(3)
    })
  })

  describe('handleAsyncError', () => {
    it('should return error message and log error', () => {
      const error = new Error('Async error')
      
      const result = handleAsyncError(error)
      
      expect(result).toBe('Async error')
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should return fallback message when no error message', () => {
      const result = handleAsyncError(null, 'Fallback message')
      
      expect(result).toBe('Fallback message')
    })

    it('should return default fallback when no message or fallback', () => {
      const result = handleAsyncError(null)
      
      expect(result).toBe('Operation failed')
    })
  })
})