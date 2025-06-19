// app/[locale]/generate-contract/page.tsx
"use client"

import GenerateContractForm from "@/components/GenerateContractForm"
import { motion } from "framer-motion"

export default function GenerateContractPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto" // Consistent container max-width
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">Create New Contract</h1>
        <p className="text-md text-muted-foreground">Fill in the details below to generate your bilingual contract.</p>
      </div>
      {/* Form container with padding, rounded corners, and shadow */}
      <div className="bg-card p-6 md:p-8 rounded-lg shadow-xl">
        <GenerateContractForm />
      </div>
    </motion.div>
  )
}
