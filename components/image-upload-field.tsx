"use client"

import React, { useState, useCallback } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { UploadCloud, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ImageUploadFieldProps {
  id: string
  name: string
  label?: string
  placeholder?: string
  existingImageUrl?: string | null
  onFileChange?: (file: File | null) => void
}

export function ImageUploadField({
  id,
  name,
  label,
  placeholder,
  existingImageUrl,
  onFileChange,
}: ImageUploadFieldProps) {
  const t = useTranslations("ImageUploadField")
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null)
  const [file, setFile] = useState<File | null>(null)

  React.useEffect(() => {
    setPreview(existingImageUrl || null)
  }, [existingImageUrl])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0]
        setFile(selectedFile)
        setPreview(URL.createObjectURL(selectedFile))
        onFileChange?.(selectedFile)
      }
    },
    [onFileChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp"],
    },
    multiple: false,
  })

  const handleRemoveImage = () => {
    setFile(null)
    setPreview(null)
    onFileChange?.(null)
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"}`}
      >
        <input id={id} name={name} {...getInputProps()} />
        {preview ? (
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage()
              }}
            >
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="sr-only">{t("removeImage")}</span>
            </Button>
          </div>
        ) : (
          <>
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground text-center">
              {isDragActive ? t("dropHere") : placeholder || t("dragAndDrop")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t("orClickToSelect")}</p>
          </>
        )}
      </div>
      {/* Hidden input to signal if image was removed when initialData was present */}
      {existingImageUrl && preview === null && <input type="hidden" name={`${name}_removed`} value="true" />}
    </div>
  )
}
