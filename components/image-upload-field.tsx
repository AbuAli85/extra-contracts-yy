"use client"
// CORE INPUT COMPONENT: Does NOT render FormLabel, FormMessage by itself.
// These will be provided by the parent FormField.
import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import placeholderSrc from "@/public/placeholder.svg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Removed Label import from here, will be used from parent
// Removed FormMessage import from here, will be used from parent
import { UploadCloudIcon, Trash2Icon, FileIcon } from "lucide-react"

interface ImageUploadFieldProps {
  field: {
    name: string
    value: File | null | undefined // Value is the File object
    onChange: (file: File | null) => void
    onBlur: () => void
    ref: React.Ref<any> // RHF provides a ref for the input
  }
  initialImageUrl?: string | null
  disabled?: boolean
  onImageRemove?: () => void
  id?: string // To connect with FormLabel from parent
}

export default function ImageUploadField({
  field,
  initialImageUrl,
  disabled,
  onImageRemove,
  id,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null) // Keep this for triggering click

  useEffect(() => {
    if (field.value instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(field.value)
      setFileName(field.value.name)
    } else if (initialImageUrl !== preview) {
      setPreview(initialImageUrl || null)
      setFileName(null)
    } else if (!field.value && !initialImageUrl) {
      setPreview(null)
      setFileName(null)
    }
  }, [field.value, initialImageUrl, preview])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    field.onChange(file || null)
  }

  const handleRemoveImage = () => {
    field.onChange(null)
    onImageRemove?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const displayPreviewUrl = field.value instanceof File ? preview : initialImageUrl

  return (
    <div className="space-y-2">
      {/* Label will be rendered by FormLabel in the parent FormField */}
      <div
        className={`relative group w-full h-48 border-2 border-dashed rounded-lg flex flex-col justify-center items-center transition-colors
                  ${disabled ? "bg-muted/50 cursor-not-allowed opacity-50" : "border-muted-foreground/30 hover:border-primary cursor-pointer"}`}
        onClick={triggerFileInput}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) triggerFileInput()
        }}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={`Upload image`} // Generic, specific label will be outside
      >
        {displayPreviewUrl ? (
          <>
            <Image
              // Use a simple placeholder path without query parameters
              src={displayPreviewUrl || placeholderSrc}
              alt={`Preview`}
              fill
              sizes="(max-width: 768px) 100vw, 480px" // Example sizes, adjust based on actual usage and container size
              style={{ objectFit: "contain" }}
              className="rounded-md p-1"
              key={displayPreviewUrl}
              onError={() => {
                // This handles browser-side loading errors for the src
                // The 400 error is likely from the Next.js optimization step before this
                // Fall back to a static placeholder without query params
                setPreview(placeholderSrc)
              }}
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
                aria-label={`Remove image`}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <UploadCloudIcon className="mx-auto h-10 w-10 mb-2" />
            <p className="text-sm">Click or drag file to upload</p>
            <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
        {/* Hidden file input, RHF ref is passed here */}
        <Input
          ref={field.ref} // Pass RHF's ref to the actual input element
          id={id || field.name} // Use provided id or field.name for label association
          name={field.name} // field.name is important for RHF
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          onBlur={field.onBlur} // Pass onBlur
          className="sr-only"
          disabled={disabled}
        />
      </div>
      {fileName && field.value instanceof File && (
        <div className="text-xs text-muted-foreground flex items-center">
          <FileIcon className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>{fileName}</span>
        </div>
      )}
      {/* FormMessage will be rendered by FormField in the parent */}
    </div>
  )
}
