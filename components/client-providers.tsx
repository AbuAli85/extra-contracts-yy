<<<<<<< HEAD
"use client"

import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/app/providers"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
      <Toaster />
    </Providers>
  )
=======
"use client"

import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/app/providers"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
      <Toaster />
    </Providers>
  )
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
}
