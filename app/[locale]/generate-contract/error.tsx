"use client"

import { Button } from "@/components/ui/button"
import { FrownIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

export default function GenerateContractError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("GenerateContractError")

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-4 py-10">
      <FrownIcon className="h-16 w-16 text-destructive" />
      <h2 className="text-2xl font-bold text-destructive">{t("title")}</h2>
      <p className="text-muted-foreground">{t("description")}</p>
      <p className="text-sm text-muted-foreground">
        {t("errorDetails")}: {error.message}
      </p>
      <Button onClick={() => reset()}>{t("tryAgain")}</Button>
    </div>
  )
}
