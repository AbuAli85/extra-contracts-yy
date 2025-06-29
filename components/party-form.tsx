"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { partySchema } from "@/lib/party-schema"
import type { Party } from "@/lib/types"
import { createParty, updateParty } from "@/hooks/use-parties"
import { useTranslations } from "next-intl"

interface PartyFormProps {
  initialData?: Party
}

export function PartyForm({ initialData }: PartyFormProps) {
  const t = useTranslations("PartyForm")
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof partySchema>>({
    resolver: zodResolver(partySchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      type: "Client",
    },
  })

  const createPartyMutation = createParty()
  const updatePartyMutation = updateParty()

  async function onSubmit(values: z.infer<typeof partySchema>) {
    let result: { success: boolean; message: string; errors?: any }

    if (initialData) {
      result = await updatePartyMutation.mutateAsync({ id: initialData.id, ...values })
    } else {
      result = await createPartyMutation.mutateAsync(values)
    }

    if (result.success) {
      toast({
        title: t("successTitle"),
        description: result.message,
      })
      router.push("/manage-parties")
      router.refresh()
    } else {
      toast({
        title: t("errorTitle"),
        description: result.message,
        variant: "destructive",
      })
      if (result.errors) {
        Object.keys(result.errors).forEach((key) => {
          form.setError(key as keyof z.infer<typeof partySchema>, {
            type: "server",
            message: result.errors[key][0],
          })
        })
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nameLabel")}</FormLabel>
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
              <FormLabel>{t("emailLabel")}</FormLabel>
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
              <FormLabel>{t("phoneLabel")}</FormLabel>
              <FormControl>
                <Input type="tel" placeholder={t("phonePlaceholder")} {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectTypePlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Client">{t("typeClient")}</SelectItem>
                  <SelectItem value="Vendor">{t("typeVendor")}</SelectItem>
                  <SelectItem value="Other">{t("typeOther")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={createPartyMutation.isPending || updatePartyMutation.isPending}
        >
          {initialData ? t("updatePartyButton") : t("createPartyButton")}
        </Button>
      </form>
    </Form>
  )
}
