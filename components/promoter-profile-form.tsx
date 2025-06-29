"use client"

import React from "react"
import { useActionState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import type { z } from "zod"

import { createPromoter } from "@/app/actions/promoters"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { promoterProfileSchema } from "@/lib/promoter-profile-schema"
import { ImageUploadField } from "@/components/image-upload-field"

interface PromoterProfileFormProps {
  onSuccess?: () => void
}

export function PromoterProfileForm({ onSuccess }: PromoterProfileFormProps) {
  const t = useTranslations("PromoterProfileForm")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof promoterProfileSchema>>({
    resolver: zodResolver(promoterProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      bio: "",
      website: "",
      profile_picture_url: null,
    },
  })

  const [state, formAction] = useActionState(createPromoter, null)

  const fileRef = React.useRef<File | null>(null)

  const handleFileChange = (file: File | null) => {
    fileRef.current = file
  }

  const onSubmit = (data: z.infer<typeof promoterProfileSchema>) => {
    const formData = new FormData()
    for (const key in data) {
      if (data[key as keyof typeof data] !== undefined && data[key as keyof typeof data] !== null) {
        if (key === "profile_picture_url") {
          // Handle file separately
          continue
        }
        formData.append(key, String(data[key as keyof typeof data]))
      }
    }
    if (fileRef.current) {
      formData.append("profile_picture_url", fileRef.current)
    }
    formAction(formData)
  }

  React.useEffect(() => {
    if (state) {
      if (state.success) {
        toast({
          title: t("success"),
          description: state.message,
        })
        form.reset()
        fileRef.current = null
        onSuccess?.()
      } else {
        toast({
          title: t("error"),
          description: state.message || t("somethingWentWrong"),
          variant: "destructive",
        })
        if (state.errors) {
          for (const [field, messages] of Object.entries(state.errors)) {
            form.setError(field as keyof typeof promoterProfileSchema, {
              type: "server",
              message: messages?.join(", "),
            })
          }
        }
      }
    }
  }, [state, toast, form, onSuccess, t])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="profile_picture_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profilePicture")}</FormLabel>
              <FormControl>
                <ImageUploadField
                  id="profile_picture_url"
                  name="profile_picture_url"
                  onFileChange={handleFileChange}
                  placeholder={t("uploadProfilePicture")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("namePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phone")}</FormLabel>
              <FormControl>
                <Input type="tel" placeholder={t("phonePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("company")}</FormLabel>
              <FormControl>
                <Input placeholder={t("companyPlaceholder")} {...field} />
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
              <FormLabel>{t("website")}</FormLabel>
              <FormControl>
                <Input type="url" placeholder={t("websitePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("address")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("addressPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("city")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("cityPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("state")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("statePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("zipCode")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("zipCodePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("country")}</FormLabel>
              <FormControl>
                <Input placeholder={t("countryPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("bio")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("bioPlaceholder")} {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("creating") : t("createPromoter")}
        </Button>
      </form>
    </Form>
  )
}
