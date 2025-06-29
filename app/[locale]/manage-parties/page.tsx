import { getTranslations } from "next-intl/server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PartyForm } from "@/components/party-form"
import { getParties } from "@/app/actions/parties"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeletePartyButton } from "@/components/delete-party-button"

export default async function ManagePartiesPage() {
  const t = await getTranslations("ManagePartiesPage")
  const { data: parties, error } = await getParties()

  if (error) {
    console.error("Error fetching parties:", error)
    return <div className="text-red-500">{t("errorLoadingParties")}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("manageParties")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("addNewParty")}</CardTitle>
          </CardHeader>
          <CardContent>
            <PartyForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("existingParties")}</CardTitle>
          </CardHeader>
          <CardContent>
            {parties && parties.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("type")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parties.map((party) => (
                    <TableRow key={party.id}>
                      <TableCell className="font-medium">{party.name}</TableCell>
                      <TableCell>{party.email}</TableCell>
                      <TableCell>{party.type}</TableCell>
                      <TableCell className="text-right">
                        <DeletePartyButton partyId={party.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">{t("noPartiesFound")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
