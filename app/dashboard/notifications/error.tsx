"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

const ErrorNotification = ({ error, reset }) => {
  const { t } = useTranslation()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-destructive">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">{t("message")}</p>
          <p className="text-sm text-muted-foreground">
            {t("details")}: {error.message}
          </p>
          <Button onClick={() => reset()}>{t("tryAgain")}</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorNotification
