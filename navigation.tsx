"use client"

import { createSharedPathnamesNavigation } from "next-intl/navigation"
import { usePathname, useRouter } from "next/navigation" // Explicitly import from next/navigation for client components

export const locales = ["en", "es"] as const
export const localePrefix = "always" // Default to "always" for explicit paths

export const { Link, redirect } = createSharedPathnamesNavigation({
  locales,
  localePrefix,
})

// Re-export usePathname and useRouter from next/navigation for client components
export { usePathname, useRouter }
