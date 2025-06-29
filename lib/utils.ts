import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createOptionalFileSchema() {
  return z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine((file) => ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type), {
      message: "File must be a JPEG, PNG, WebP image or PDF",
    })
    .optional()
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A"

  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return "Invalid Date"

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj)
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "N/A"

  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return "Invalid Date"

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

export function formatCurrency(amount: number | null | undefined, currency = "USD"): string {
  if (amount === null || amount === undefined) return "N/A"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A"

  return new Intl.NumberFormat("en-US").format(num)
}

export function formatPercentage(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A"

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num / 100)
}

export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return ""

  if (text.length <= maxLength) return text

  return text.slice(0, maxLength) + "..."
}

export function capitalizeFirst(str: string | null | undefined): string {
  if (!str) return ""

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateId(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}

export function getFileSizeString(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "absolute"
    textArea.style.left = "-999999px"

    document.body.prepend(textArea)
    textArea.select()

    try {
      document.execCommand("copy")
    } catch (error) {
      console.error("Failed to copy text: ", error)
    } finally {
      textArea.remove()
    }

    return Promise.resolve()
  }
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?"

  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function getRandomColor(): string {
  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

export function parseJSON<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback

  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => delete result[key])
  return result
}

export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const group = String(item[key])
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    },
    {} as Record<string, T[]>,
  )
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "object") return Object.keys(value).length === 0
  return false
}

export function isEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (!a || !b || (typeof a !== "object" && typeof b !== "object")) {
    return a === b
  }

  if (a === null || a === undefined || b === null || b === undefined) {
    return false
  }

  if (a.prototype !== b.prototype) return false

  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) {
    return false
  }

  return keys.every((k) => isEqual(a[k], b[k]))
}
