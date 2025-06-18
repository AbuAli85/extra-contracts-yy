"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { partyFormSchema, type PartyFormData } from "@/lib/party-schema"
import type { Party } from "@/lib/types"
import { createBrowserClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"

const supabase = createBrowserClient()

interface PartyFormProps {
  partyToEdit?: Party | null
  onFormSubmit: () => void
}

export default function PartyForm({ partyToEdit, onFormSubmit }: PartyFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PartyFormData>({
    resolver: zodResolver(partyFormSchema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      crn: "",
    },
  })

  useEffect(() => {
    if (partyToEdit) {
      form.reset({
        name_en: partyToEdit.name_en || "",
        name_ar: partyToEdit.name_ar || "",
        crn: partyToEdit.crn || "",
      })
    } else {
      form.reset({
        name_en: "",
        name_ar: "",
        crn: "",
      })
    }
  }, [partyToEdit, form])

  async function onSubmit(values: PartyFormData) {
    setIsSubmitting(true)
    try {
      const partyData: Omit<Party, "id"> = {
        name_en: values.name_en,
        name_ar: values.name_ar,
        crn: values.crn,
      }

      if (partyToEdit?.id) {
        const { error } = await supabase.from("parties").update(partyData).eq("id", partyToEdit.id).select()
        if (error) throw error
        toast({ title: "Success!", description: "Party updated successfully." })
      } else {
        const { error } = await supabase.from("parties").insert(partyData).select()
        if (error) throw error
        toast({ title: "Success!", description: "Party added successfully." })
      }
      onFormSubmit()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-card text-card-foreground shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        {partyToEdit ? "Edit Party" : "Add New Party"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (English)</FormLabel>
                <FormControl>
                  <Input placeholder="Party Name (EN)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name_ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم (عربي)</FormLabel>
                <FormControl>
                  <Input placeholder="اسم الطرف (AR)" {...field} dir="rtl" className="text-right" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="crn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commercial Registration Number (CRN) / رقم السجل التجاري</FormLabel>
                <FormControl>
                  <Input placeholder="1010XXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {partyToEdit ? "Update Party" : "Add Party"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
