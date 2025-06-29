import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon, EditIcon, GlobeIcon } from "lucide-react"
import { getPromoterById } from "@/lib/data"
import Image from "next/image"
import { format } from "date-fns"

interface PromoterDetailsPageProps {
  params: {
    id: string
  }
}

export default async function PromoterDetailsPage({ params }: PromoterDetailsPageProps) {
  const promoter = await getPromoterById(params.id)

  if (!promoter) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/manage-promoters">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Promoters
          </Link>
        </Button>
        <h1 className="ml-auto text-2xl font-semibold">Promoter Details</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-4">
            {promoter.logo_url && (
              <Image
                src={promoter.logo_url || "/placeholder.svg"}
                alt={`${promoter.name_en} logo`}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <CardTitle className="text-xl font-medium">{promoter.name_en}</CardTitle>
              <p className="text-sm text-muted-foreground">{promoter.name_ar}</p>
            </div>
          </div>
          <Button size="sm" asChild>
            <Link href={`/manage-promoters/${promoter.id}/edit`}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit Promoter
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{promoter.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{promoter.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{promoter.address || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">City</p>
              <p className="font-medium">{promoter.city || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Country</p>
              <p className="font-medium">{promoter.country || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Zip Code</p>
              <p className="font-medium">{promoter.zip_code || "N/A"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{promoter.contact_person || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{promoter.contact_person_email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{promoter.contact_person_phone || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Other Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="font-medium">
                  {promoter.website ? (
                    <a
                      href={promoter.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {promoter.website} <GlobeIcon className="inline-block h-4 w-4 ml-1" />
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{format(new Date(promoter.created_at), "PPP p")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated At</p>
                <p className="font-medium">{format(new Date(promoter.updated_at), "PPP p")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
