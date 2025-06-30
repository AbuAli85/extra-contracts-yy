import {
  formatCurrency,
  formatDate,
  slugify,
  truncateText,
  capitalizeFirst,
  getInitials,
} from "../utils"

describe("utils", () => {
  describe("formatCurrency", () => {
    it("formats number as USD currency", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56")
    })

    it("returns N/A for nullish values", () => {
      expect(formatCurrency(null)).toBe("N/A")
      expect(formatCurrency(undefined)).toBe("N/A")
    })

    it("supports different currencies", () => {
      expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56")
    })
  })

  describe("formatDate", () => {
    it("formats Date objects", () => {
      const date = new Date("2023-12-31T00:00:00Z")
      expect(formatDate(date)).toBe("Dec 31, 2023")
    })

    it("handles date strings", () => {
      expect(formatDate("2023-12-31")).toBe("Dec 31, 2023")
    })

    it("returns Invalid Date for bad input", () => {
      expect(formatDate("not-a-date")).toBe("Invalid Date")
    })

    it("returns N/A for nullish values", () => {
      expect(formatDate(null)).toBe("N/A")
      expect(formatDate(undefined)).toBe("N/A")
    })
  })

  describe("slugify", () => {
    it("converts text to a slug", () => {
      expect(slugify("Hello World!"))
        .toBe("hello-world")
    })

    it("handles extra spaces and punctuation", () => {
      expect(slugify("  This -- is a test!  ")).toBe("this-is-a-test")
    })
  })

  describe("truncateText", () => {
    it("truncates long text", () => {
      expect(truncateText("Hello world", 5)).toBe("Hello...")
    })

    it("returns the text if shorter than max", () => {
      expect(truncateText("Short", 10)).toBe("Short")
    })
  })

  describe("capitalizeFirst", () => {
    it("capitalizes first letter and lowercases rest", () => {
      expect(capitalizeFirst("hELLO")).toBe("Hello")
    })

    it("returns empty string for nullish", () => {
      expect(capitalizeFirst(null)).toBe("")
      expect(capitalizeFirst(undefined)).toBe("")
    })
  })

  describe("getInitials", () => {
    it("extracts initials from name", () => {
      expect(getInitials("John Doe")).toBe("JD")
    })

    it("handles multiple names", () => {
      expect(getInitials("Alice Bob Carol")).toBe("AB")
    })

    it("returns ? for empty input", () => {
      expect(getInitials(undefined)).toBe("?")
    })
  })
})
