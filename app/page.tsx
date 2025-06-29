import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileTextIcon, UsersIcon, BarChartIcon } from "lucide-react"

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-4 md:p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Welcome to the Bilingual Contract Generator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate, manage, and track your contracts in both English and Arabic with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="flex flex-col items-center text-center p-6">
          <FileTextIcon className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="mb-2">Manage Contracts</CardTitle>
          <CardDescription className="mb-4">Create, view, and edit your bilingual contracts.</CardDescription>
          <Button asChild>
            <Link href="/contracts">Go to Contracts</Link>
          </Button>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <UsersIcon className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="mb-2">Parties & Promoters</CardTitle>
          <CardDescription className="mb-4">
            Manage all your contract parties and promoters in one place.
          </CardDescription>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/manage-parties">Manage Parties</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/manage-promoters">Manage Promoters</Link>
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <BarChartIcon className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="mb-2">Dashboard & Analytics</CardTitle>
          <CardDescription className="mb-4">
            Get insights into your contract statuses and system activities.
          </CardDescription>
          <Button asChild>
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </Card>
      </div>
    </main>
  )
}
