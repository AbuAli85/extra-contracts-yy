"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { promoterProfileSchema } from "@/lib/promoter-profile-schema"
import { ImageUploadField } from "./image-upload-field"
import { createPromoter, updatePromoter } from "@/app/actions/promoters" // Assuming these actions exist

interface PromoterProfileFormProps {
  // If editing an existing profile, pass the data
  promoter?: z.infer<typeof promoterProfileSchema> & { id?: string }
}

export function PromoterProfileForm({ promoter }: PromoterProfileFormProps) {
  const t = useTranslations("PromoterProfileForm")
  const { toast } = useToast()
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof promoterProfileSchema>>({
    resolver: zodResolver(promoterProfileSchema),
    defaultValues: {
      name: promoter?.name || "",
      contact_email: promoter?.contact_email || "",
      contact_phone: promoter?.contact_phone || "",
      company_name: promoter?.company_name || "",
      website: promoter?.website || "",
      profile_picture_url: promoter?.profile_picture_url || null,
    },
  })

  const [createState, createAction, createPending] = useActionState(createPromoter, {
    success: false,
    message: "",
  })
  const [updateState, updateAction, updatePending] = useActionState(
    // Bind promoter.id to the updatePromoter action if promoter exists
    promoter?.id
      ? updatePromoter.bind(null, promoter.id)
      : async () => ({ success: false, message: "No promoter ID provided for update." }),
    { success: false, message: "" },
  )

  useEffect(() => {
    const state = promoter ? updateState : createState
    if (state.message) {
      toast({
        title: state.success ? t("successMessage") : t("errorMessage"),
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success) {
        // Optionally reset form or redirect
        // form.reset();
      }
    }
    if (state.errors) {
      for (const field in state.errors) {
        form.setError(field as keyof z.infer<typeof promoterProfileSchema>, {
          type: "server",
          message: state.errors[field]?.[0],
        })
      }
    }
  }, [createState, updateState, toast, t, form, promoter])

  const onSubmit = (data: z.infer<typeof promoterProfileSchema>) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
    if (profilePictureFile) {
      formData.append("profile_picture", profilePictureFile)
    }

    if (promoter?.id) {
      updateAction(formData)
    } else {
      createAction(formData)
    }
  }

  const isPending = createPending || updatePending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nameLabel")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contactEmailLabel")}</FormLabel>
              <FormControl>
                <Input type="email" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contactPhoneLabel")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("companyNameLabel")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("websiteLabel")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile_picture_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profilePictureLabel")}</FormLabel>
              <FormControl>
                <ImageUploadField
                  label={t("profilePictureLabel")}
                  value={field.value || undefined}
                  onChange={setProfilePictureFile}
                  onClear={() => {
                    field.onChange(null) // Clear the URL in the form state
                    setProfilePictureFile(null) // Clear the file state
                  }}
                  disabled={isPending}
                  isLoading={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {promoter ? t("updateButton") : t("submitButton")}
        </Button>
      </form>
    </Form>
  )
}
