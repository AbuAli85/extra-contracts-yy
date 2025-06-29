import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FrownIcon } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-4 py-10">
      <FrownIcon className="h-16 w-16 text-primary" />
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}
