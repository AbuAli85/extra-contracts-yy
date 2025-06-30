import {
  cn,
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  truncateText,
  capitalizeFirst,
  slugify,
  generateId,
  debounce,
  throttle,
  sleep,
  isValidEmail,
  isValidUrl,
  getFileExtension,
  getFileSizeString,
  getInitials,
  parseJSON,
  omit,
  pick,
  groupBy,
  unique,
  chunk,
  isEmpty,
  isEqual,
} from "@/lib/utils"

// Mock timers for debounce and throttle tests
jest.useFakeTimers()

describe("Utility Functions", () => {
  describe("cn (className utility)", () => {
    it("should merge class names correctly", () => {
      expect(cn("px-2 py-1", "text-sm")).toBe("px-2 py-1 text-sm")
    })

    it("should handle conditional classes", () => {
      expect(cn("base", false && "conditional", "always")).toBe("base always")
    })

    it("should merge conflicting Tailwind classes", () => {
      expect(cn("px-2", "px-4")).toBe("px-4")
    })
  })

  describe("formatDate", () => {
    it("should format a valid date", () => {
      const date = new Date("2023-01-15")
      expect(formatDate(date)).toBe("Jan 15, 2023")
    })

    it("should format a date string", () => {
      expect(formatDate("2023-01-15")).toBe("Jan 15, 2023")
    })

    it("should return N/A for null/undefined", () => {
      expect(formatDate(null)).toBe("N/A")
      expect(formatDate(undefined)).toBe("N/A")
    })

    it("should return Invalid Date for invalid date strings", () => {
      expect(formatDate("invalid-date")).toBe("Invalid Date")
    })
  })

  describe("formatDateTime", () => {
    it("should format a valid datetime", () => {
      const date = new Date("2023-01-15T10:30:00")
      const result = formatDateTime(date)
      expect(result).toMatch(/Jan 15, 2023.*10:30 AM/)
    })

    it("should return N/A for null/undefined", () => {
      expect(formatDateTime(null)).toBe("N/A")
      expect(formatDateTime(undefined)).toBe("N/A")
    })
  })

  describe("formatCurrency", () => {
    it("should format currency with default USD", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56")
    })

    it("should format currency with specified currency", () => {
      expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56")
    })

    it("should return N/A for null/undefined", () => {
      expect(formatCurrency(null)).toBe("N/A")
      expect(formatCurrency(undefined)).toBe("N/A")
    })
  })

  describe("formatNumber", () => {
    it("should format numbers with thousands separators", () => {
      expect(formatNumber(1234567)).toBe("1,234,567")
    })

    it("should return N/A for null/undefined", () => {
      expect(formatNumber(null)).toBe("N/A")
      expect(formatNumber(undefined)).toBe("N/A")
    })
  })

  describe("formatPercentage", () => {
    it("should format percentage correctly", () => {
      expect(formatPercentage(75.5)).toBe("75.5%")
    })

    it("should return N/A for null/undefined", () => {
      expect(formatPercentage(null)).toBe("N/A")
      expect(formatPercentage(undefined)).toBe("N/A")
    })
  })

  describe("truncateText", () => {
    it("should truncate long text", () => {
      expect(truncateText("This is a very long text", 10)).toBe("This is a ...")
    })

    it("should return original text if within limit", () => {
      expect(truncateText("Short", 10)).toBe("Short")
    })

    it("should return empty string for null/undefined", () => {
      expect(truncateText(null, 10)).toBe("")
      expect(truncateText(undefined, 10)).toBe("")
    })
  })

  describe("capitalizeFirst", () => {
    it("should capitalize first letter and lowercase rest", () => {
      expect(capitalizeFirst("hello WORLD")).toBe("Hello world")
    })

    it("should return empty string for null/undefined", () => {
      expect(capitalizeFirst(null)).toBe("")
      expect(capitalizeFirst(undefined)).toBe("")
    })
  })

  describe("slugify", () => {
    it("should create URL-friendly slugs", () => {
      expect(slugify("Hello World! This is a Test")).toBe("hello-world-this-is-a-test")
    })

    it("should handle special characters", () => {
      expect(slugify("Test@#$%^&*()_+")).toBe("test")
    })

    it("should handle multiple spaces and hyphens", () => {
      expect(slugify("  multiple   spaces  ")).toBe("multiple-spaces")
    })
  })

  describe("generateId", () => {
    it("should generate ID of default length", () => {
      const id = generateId()
      expect(id).toHaveLength(8)
      expect(/^[A-Za-z0-9]+$/.test(id)).toBe(true)
    })

    it("should generate ID of specified length", () => {
      const id = generateId(12)
      expect(id).toHaveLength(12)
    })

    it("should generate unique IDs", () => {
      const ids = Array.from({ length: 100 }, () => generateId())
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(100)
    })
  })

  describe("debounce", () => {
    it("should delay function execution", () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn("test")
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledWith("test")
    })

    it("should cancel previous calls", () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn("first")
      debouncedFn("second")
      
      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith("second")
    })
  })

  describe("throttle", () => {
    it("should limit function calls", () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn("first")
      throttledFn("second")
      throttledFn("third")

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith("first")

      jest.advanceTimersByTime(100)
      throttledFn("fourth")
      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenCalledWith("fourth")
    })
  })

  describe("sleep", () => {
    it("should return a promise that resolves after specified time", async () => {
      jest.useRealTimers()
      const start = Date.now()
      await sleep(10)
      const end = Date.now()
      expect(end - start).toBeGreaterThanOrEqual(10)
      jest.useFakeTimers()
    })
  })

  describe("isValidEmail", () => {
    it("should validate correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true)
      expect(isValidEmail("user.name+tag@domain.co.uk")).toBe(true)
    })

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("invalid-email")).toBe(false)
      expect(isValidEmail("@domain.com")).toBe(false)
      expect(isValidEmail("user@")).toBe(false)
    })
  })

  describe("isValidUrl", () => {
    it("should validate correct URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true)
      expect(isValidUrl("http://localhost:3000")).toBe(true)
    })

    it("should reject invalid URLs", () => {
      expect(isValidUrl("not-a-url")).toBe(false)
      expect(isValidUrl("")).toBe(false)
    })
  })

  describe("getFileExtension", () => {
    it("should extract file extensions", () => {
      expect(getFileExtension("document.pdf")).toBe("pdf")
      expect(getFileExtension("image.jpg")).toBe("jpg")
      expect(getFileExtension("file.name.with.dots.txt")).toBe("txt")
    })

    it("should handle files without extensions", () => {
      expect(getFileExtension("filename")).toBe("")
    })
  })

  describe("getFileSizeString", () => {
    it("should format file sizes correctly", () => {
      expect(getFileSizeString(0)).toBe("0 Bytes")
      expect(getFileSizeString(1024)).toBe("1 KB")
      expect(getFileSizeString(1024 * 1024)).toBe("1 MB")
      expect(getFileSizeString(1536)).toBe("1.5 KB")
    })
  })

  describe("getInitials", () => {
    it("should get initials from names", () => {
      expect(getInitials("John Doe")).toBe("JD")
      expect(getInitials("Mary Jane Watson")).toBe("MJ")
    })

    it("should handle single names", () => {
      expect(getInitials("Madonna")).toBe("M")
    })

    it("should return ? for null/undefined", () => {
      expect(getInitials(null)).toBe("?")
      expect(getInitials(undefined)).toBe("?")
    })
  })

  describe("parseJSON", () => {
    it("should parse valid JSON", () => {
      expect(parseJSON('{"key": "value"}', {})).toEqual({ key: "value" })
    })

    it("should return fallback for invalid JSON", () => {
      expect(parseJSON("invalid json", { fallback: true })).toEqual({ fallback: true })
    })

    it("should return fallback for null/undefined", () => {
      expect(parseJSON(null, { fallback: true })).toEqual({ fallback: true })
    })
  })

  describe("omit", () => {
    it("should omit specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(omit(obj, ["b"])).toEqual({ a: 1, c: 3 })
    })
  })

  describe("pick", () => {
    it("should pick specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 })
    })

    it("should handle non-existent keys", () => {
      const obj = { a: 1, b: 2 }
      expect(pick(obj, ["a", "nonexistent" as any])).toEqual({ a: 1 })
    })
  })

  describe("groupBy", () => {
    it("should group array items by key", () => {
      const items = [
        { type: "fruit", name: "apple" },
        { type: "vegetable", name: "carrot" },
        { type: "fruit", name: "banana" },
      ]
      
      const grouped = groupBy(items, "type")
      expect(grouped.fruit).toHaveLength(2)
      expect(grouped.vegetable).toHaveLength(1)
    })
  })

  describe("unique", () => {
    it("should remove duplicates from array", () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(unique(["a", "b", "a", "c"])).toEqual(["a", "b", "c"])
    })
  })

  describe("chunk", () => {
    it("should split array into chunks", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]])
    })
  })

  describe("isEmpty", () => {
    it("should detect empty values", () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty("")).toBe(true)
      expect(isEmpty("   ")).toBe(true)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty({})).toBe(true)
    })

    it("should detect non-empty values", () => {
      expect(isEmpty("text")).toBe(false)
      expect(isEmpty([1])).toBe(false)
      expect(isEmpty({ key: "value" })).toBe(false)
      expect(isEmpty(0)).toBe(false)
    })
  })

  describe("isEqual", () => {
    it("should compare primitive values", () => {
      expect(isEqual(1, 1)).toBe(true)
      expect(isEqual("a", "a")).toBe(true)
      expect(isEqual(1, 2)).toBe(false)
    })

    it("should compare dates", () => {
      const date1 = new Date("2023-01-01")
      const date2 = new Date("2023-01-01")
      const date3 = new Date("2023-01-02")
      
      expect(isEqual(date1, date2)).toBe(true)
      expect(isEqual(date1, date3)).toBe(false)
    })

    it("should compare objects", () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
    })

    it("should handle null/undefined", () => {
      expect(isEqual(null, null)).toBe(true)
      expect(isEqual(null, undefined)).toBe(false)
    })
  })
})

// Restore real timers after all tests
afterAll(() => {
  jest.useRealTimers()
})