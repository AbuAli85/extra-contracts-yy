// File: app/generate-contract/page.tsx
"use client"

<<<<<<< HEAD
import ContractGeneratorForm from "../../components/ContractGeneratorForm"
=======
import ContractGeneratorForm from "@/components/ContractGeneratorForm"
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a

export default function GenerateContractPage() {
  const handleFormSubmit = (data: any) => {
    /* … */
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Create New Contract</h1>
<<<<<<< HEAD
      <ContractGeneratorForm onFormSubmit={handleFormSubmit} />
=======
      <ContractGeneratorForm />
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
    </div>
  )
}
