"use client"

import { cn } from "@/lib/utils"

import React, { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "next-intl"

interface ImageUploadFieldProps {
  label: string
  value?: string | null // Current image URL
  onChange: (file: File | null) => void // Callback for file change
  onClear?: () => void // Callback for clearing the image
  previewSize?: "sm" | "md" | "lg"
  disabled?: boolean
  isLoading?: boolean
}

export function ImageUploadField({
  label,
  value,
  onChange,
  onClear,
  previewSize = "md",
  disabled,
  isLoading,
}: ImageUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null)
  const { toast } = useToast()
  const t = useTranslations("ImageUploadField")

  React.useEffect(() => {
    setPreviewUrl(value || null)
  }, [value])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        if (!file.type.startsWith("image/")) {
          toast({
            title: t("invalidFileType"),
            description: t("onlyImagesAllowed"),
            variant: "destructive",
          })
          return
        }
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          toast({
            title: t("fileTooLarge"),
            description: t("maxSizeExceeded"),
            variant: "destructive",
          })
          return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
        onChange(file)
      } else {
        setPreviewUrl(null)
        onChange(null)
      }
    },
    [onChange, toast, t],
  )

  const handleClear = useCallback(() => {
    setPreviewUrl(null)
    onChange(null)
    if (onClear) {
      onClear()
    }
    // Clear the input field value to allow re-uploading the same file
    const input = document.getElementById(`file-upload-${label}`) as HTMLInputElement
    if (input) {
      input.value = ""
    }
  }, [onChange, onClear, label])

  const sizeClasses = {
    sm: "h-16 w-16 text-lg",
    md: "h-24 w-24 text-xl",
    lg: "h-32 w-32 text-2xl",
  }

  return (
    <div className="flex items-center gap-4">
      <Label htmlFor={`file-upload-${label}`} className="sr-only">
        {label}
      </Label>
      <div className="relative">
        <Avatar className={cn("border", sizeClasses[previewSize])}>
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <AvatarImage src={previewUrl || undefined} alt={label} />
              <AvatarFallback className="text-muted-foreground">
                <Camera className="h-1/2 w-1/2" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        {previewUrl && !disabled && !isLoading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background"
            onClick={handleClear}
            aria-label={t("clearImage")}
          >
            <XCircle className="h-5 w-5 text-destructive" />
          </Button>
        )}
      </div>
      <Input
        id={`file-upload-${label}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="max-w-xs cursor-pointer"
        disabled={disabled || isLoading}
      />
    </div>
  )
}
