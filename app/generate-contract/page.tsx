import { Suspense } from "react"
import ContractGeneratorForm from "@/components/contract-generator-form"

function PageContent() {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <ContractGeneratorForm />
    </div>
  )
}

export default function GenerateContractPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">Loading...</div>
      }
    >
      <PageContent />
    </Suspense>
  )
}
