import { getTranslations } from "next-intl/server"
import ContractReportsTable from "@/components/dashboard/contract-reports-table"
import { getContracts } from "@/lib/data"

export default async function DashboardContractsPage() {
  const t = await getTranslations("DashboardContracts")
  const contracts = await getContracts() // Fetch all contracts for the table

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-2xl font-semibold">{t("contractsTitle")}</h1>
      <ContractReportsTable initialContracts={contracts} />
    </main>
  )
}
