import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to create a Zod schema for optional file uploads
// This is browser-aware, meaning it handles File objects in the browser
// and strings (URLs) which might come from initial data or server-side processing.
export const createOptionalFileSchema = (
  maxSize: number,
  acceptedTypes: string[],
  sizeErrorMessage: string,
  typeErrorMessage: string,
) =>
  z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= maxSize, sizeErrorMessage)
        .refine((file) => acceptedTypes.includes(file.type), typeErrorMessage),
      z
        .string()
        .url()
        .nullable(), // For existing URLs
      z.null(),
      z.undefined(),
    ])
    .optional()
    .nullable()
