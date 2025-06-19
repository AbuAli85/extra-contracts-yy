"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { formSchema } from "@/lib/generate-contract-form-schema"

export default function GenerateContractForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}></form>
}
