import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon, FilePlus2Icon, ExternalLinkIcon, UsersIcon, BuildingIcon, History } from "lucide-react"
import AuthStatus from "@/components/auth-status"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Bilingual Contract Management</CardTitle>
          <CardDescription className="text-center">Choose an action below to proceed.</CardDescription>
        </CardHeader>
        <AuthStatus />
        <CardContent className="space-y-4 pt-6">
          <Button asChild variant="default" className="w-full justify-start">
            <Link href="/generate-contract">
              <FilePlus2Icon className="mr-2 h-5 w-5" />
              Generate New Contract
            </Link>
          </Button>
          <Button asChild variant="secondary" className="w-full justify-start">
            <Link href="/contracts">
              <History className="mr-2 h-5 w-5" />
              View Contract History & Status
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/manage-promoters">
              <UsersIcon className="mr-2 h-5 w-5" />
              Manage Promoters
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/manage-parties">
              <BuildingIcon className="mr-2 h-5 w-5" />
              Manage Parties
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/request-contract">
              <FileTextIcon className="mr-2 h-5 w-5" />
              Request New Contract (Manual Form)
            </Link>
          </Button>
          <a href="/index.html" target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full justify-start">
              <ExternalLinkIcon className="mr-2 h-5 w-5" />
              View Static HTML Form (Make.com)
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
