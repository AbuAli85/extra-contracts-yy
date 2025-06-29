"use client"

import React from "react"
import { useActionState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import type { z } from "zod"

import { createParty } from "@/app/actions/parties"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { partySchema } from "@/lib/party-schema"

interface PartyFormProps {
  onSuccess?: () => void
}

export function PartyForm({ onSuccess }: PartyFormProps) {
  const t = useTranslations("PartyForm")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof partySchema>>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      type: "Individual",
    },
  })

  const [state, formAction] = useActionState(createParty, null)

  React.useEffect(() => {
    if (state) {
      if (state.success) {
        toast({
          title: t("success"),
          description: state.message,
        })
        form.reset()
        onSuccess?.()
      } else {
        toast({
          title: t("error"),
          description: state.message || t("somethingWentWrong"),
          variant: "destructive",
        })
        if (state.errors) {
          for (const [field, messages] of Object.entries(state.errors)) {
            form.setError(field as keyof typeof partySchema, {
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
      <form action={formAction} className="space-y-6">
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
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("type")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Individual">{t("individual")}</SelectItem>
                  <SelectItem value="Company">{t("company")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("creating") : t("createParty")}
        </Button>
      </form>
    </Form>
  )
}
