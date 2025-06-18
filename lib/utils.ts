import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Determine if the current runtime has access to the browser `File` API.
 * This helps schemas validate file inputs only when the `File` constructor
 * exists, which is not the case in server environments.
 */
export const isBrowser = typeof window !== "undefined" && typeof File !== "undefined"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
