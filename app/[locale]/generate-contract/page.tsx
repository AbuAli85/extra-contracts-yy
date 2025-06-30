// app/[locale]/generate-contract/page.tsx
"use client"

import GenerateContractForm from "@/components/generate-contract-form"
import { motion } from "framer-motion"

export default function GenerateContractPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl" // Consistent container max-width
    >
      <div className="mb-10 text-center">
        <h1 className="mb-3 font-heading text-3xl font-bold md:text-4xl">Create New Contract</h1>
        <p className="text-md text-muted-foreground">
          Fill in the details below to generate your bilingual contract.
        </p>
      </div>
      {/* Form container with padding, rounded corners, and shadow */}
      <div className="rounded-lg bg-card p-6 shadow-xl md:p-8">
        <GenerateContractForm />
      </div>
    </motion.div>
  )
}
