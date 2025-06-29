"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { PendingReview } from "@/lib/dashboard-types"
import { useTranslations } from "next-intl"
import { FileText, UserRound } from "lucide-react"

interface ReviewPanelProps {
  reviews: PendingReview[]
}

export function ReviewPanel({ reviews }: ReviewPanelProps) {
  const t = useTranslations("ReviewPanel")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">{t("noPendingReviews")}</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="flex items-center gap-4 rounded-md border p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.avatar || "/placeholder-user.jpg"} alt={review.submitter} />
                  <AvatarFallback>
                    {review.type === "Contract" ? <FileText className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 gap-1">
                  <p className="font-medium">{review.title}</p>
                  <p className="text-sm text-muted-foreground">{review.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("submittedBy")} {review.submitter} {t("on")} {review.period}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t("review")}
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
