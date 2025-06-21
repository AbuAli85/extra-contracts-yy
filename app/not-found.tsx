import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-3xl font-bold">Page Not Found</h2>
      <p className="text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  )
}
