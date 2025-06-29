import { getTranslations } from "next-intl/server"

import ContractReportsTable from "@/components/dashboard/contract-reports-table" // Default import

export default async function ContractsPage() {
  const t = await getTranslations("DashboardContractsPage")

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("contractReports")}</h1>
      <ContractReportsTable />
    </div>
  )
}
