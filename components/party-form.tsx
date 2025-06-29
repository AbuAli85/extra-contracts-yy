"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createParty, updateParty } from "@/app/actions/parties"
import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { type Party, PartyType } from "@/lib/types"
import { partySchema } from "@/lib/party-schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PartyFormProps {
  party?: Party // Optional prop for editing existing parties
  onFormSuccess?: () => void // Callback to close dialog on success
}

export function PartyForm({ party, onFormSuccess }: PartyFormProps) {
  const t = useTranslations("PartyForm")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof partySchema>>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      name: party?.name || "",
      type: party?.type || PartyType.Individual, // Default to Individual
      contact_email: party?.contact_email || "",
      contact_phone: party?.contact_phone || "",
      address: party?.address || "",
    },
  })

  const [createState, createAction, createPending] = useActionState(createParty, {
    success: false,
    message: "",
  })
  const [updateState, updateAction, updatePending] = useActionState(
    // Bind party.id to the updateParty action if party exists
    party
      ? updateParty.bind(null, party.id)
      : async () => ({ success: false, message: "No party ID provided for update." }),
    { success: false, message: "" },
  )

  useEffect(() => {
    const state = party ? updateState : createState
    if (state.message) {
      toast({
        title: state.success ? t("successMessage") : t("errorMessage"),
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success && onFormSuccess) {
        onFormSuccess()
      }
    }
    if (state.errors) {
      for (const field in state.errors) {
        form.setError(field as keyof z.infer<typeof partySchema>, {
          type: "server",
          message: state.errors[field]?.[0],
        })
      }
    }
  }, [createState, updateState, toast, t, form, party, onFormSuccess])

  const onSubmit = (data: z.infer<typeof partySchema>) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })

    if (party) {
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("typeLabel")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(PartyType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addressLabel")}</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {party ? t("updateButton") : t("submitButton")}
        </Button>
      </form>
    </Form>
  )
}
