"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { promoterProfileSchema } from "@/lib/promoter-profile-schema"
import type { Promoter } from "@/lib/types"
import { createPromoter, updatePromoter } from "@/app/actions/promoters"
import ImageUploadField from "@/components/image-upload-field"

interface PromoterFormProps {
  initialData?: Promoter
}

// Changed to default export
export default function PromoterForm({ initialData }: PromoterFormProps) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof promoterProfileSchema>>({
    resolver: zodResolver(promoterProfileSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      company_name: "",
      company_address: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      website: "",
      notes: "",
      logo_url: null,
    },
  })

  async function onSubmit(values: z.infer<typeof promoterProfileSchema>) {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    })

    let result: { success: boolean; message: string; errors?: any }

    if (initialData) {
      result = await updatePromoter(initialData.id, formData)
    } else {
      result = await createPromoter(formData)
    }

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      router.push("/manage-promoters")
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
      if (result.errors) {
        Object.keys(result.errors).forEach((key) => {
          form.setError(key as keyof z.infer<typeof promoterProfileSchema>, {
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
              <FormLabel>Promoter Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
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
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="123-456-7890" {...field} />
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
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main St, Anytown, USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Contact Person (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Jane Smith" {...field} />
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
              <FormLabel>Additional Contact Email (Optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane.smith@example.com" {...field} />
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
              <FormLabel>Additional Contact Phone (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="098-765-4321" {...field} />
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
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://www.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any relevant notes about the promoter." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo_url"
          render={({ field: { onChange, value, ...restField } }) => (
            <FormItem>
              <FormLabel>Company Logo (Optional)</FormLabel>
              <FormControl>
                <ImageUploadField
                  onFileChange={(file) => onChange(file)}
                  existingImageUrl={typeof value === "string" ? value : undefined}
                  id="logo_url"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {initialData ? "Update Promoter" : "Create Promoter"}
        </Button>
      </form>
    </Form>
  )
}
