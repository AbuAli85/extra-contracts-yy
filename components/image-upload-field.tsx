"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, UploadCloud, XCircle } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"
import { useTranslations } from "next-intl"

interface ImageUploadFieldProps {
  value: string | undefined
  onChange: (url: string | undefined) => void
  label?: string
  placeholder?: string
  folder?: string // Supabase storage folder
  disabled?: boolean
}

export default function ImageUploadField({
  value,
  onChange,
  label = "Image Upload",
  placeholder = "Upload an image",
  folder = "public", // Default Supabase folder
  disabled = false,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()
  const t = useTranslations("ImageUploadField")

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length === 0) {
        toast({
          title: t("noFileSelected"),
          description: t("pleaseSelectFile"),
          variant: "destructive",
        })
        return
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      setUploading(true)

      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file)

      if (uploadError) {
        toast({
          title: t("uploadError"),
          description: uploadError.message,
          variant: "destructive",
        })
        setUploading(false)
        return
      }

      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(filePath)

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl)
        toast({
          title: t("uploadSuccess"),
          description: t("imageUploadedSuccessfully"),
        })
      } else {
        toast({
          title: t("publicUrlError"),
          description: t("couldNotGetPublicUrl"),
          variant: "destructive",
        })
      }
      setUploading(false)
    },
    [onChange, folder, supabase.storage, toast, t],
  )

  const handleRemoveImage = useCallback(async () => {
    if (!value) return

    setUploading(true) // Use uploading state for deletion too
    try {
      const urlParts = value.split("/")
      const fileNameWithFolder = urlParts.slice(urlParts.indexOf(folder)).join("/")

      const { error: deleteError } = await supabase.storage.from("images").remove([fileNameWithFolder])

      if (deleteError) {
        throw deleteError
      }

      onChange(undefined)
      toast({
        title: t("removeSuccess"),
        description: t("imageRemovedSuccessfully"),
      })
    } catch (error: any) {
      toast({
        title: t("removeError"),
        description: error.message || t("failedToRemoveImage"),
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }, [value, onChange, folder, supabase.storage, toast, t])

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>
      {value ? (
        <div className="relative w-32 h-32 rounded-md overflow-hidden border group">
          <Image src={value || "/placeholder.svg"} alt="Uploaded image" layout="fill" objectFit="cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveImage}
            disabled={uploading || disabled}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            <span className="sr-only">{t("removeImage")}</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors">
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">{placeholder}</span>
              </>
            )}
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="sr-only"
              disabled={uploading || disabled}
            />
          </Label>
        </div>
      )}
      {uploading && <p className="text-sm text-muted-foreground">{t("uploading")}</p>}
    </div>
  )
}
