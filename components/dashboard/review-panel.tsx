"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "next-intl"
import type { Review } from "@/lib/dashboard-types"

interface ReviewPanelProps {
  reviews: Review[]
}

export function ReviewPanel({ reviews }: ReviewPanelProps) {
  const { toast } = useToast()
  const t = useTranslations("DashboardReviewPanel")

  const handleReview = (reviewId: string, action: "approve" | "reject") => {
    toast({
      title: t("reviewAction"),
      description: t("reviewActionDescription", { action, reviewId }),
    })
    // In a real application, you would call a server action or API route here
    console.log(`Review ${reviewId} ${action}ed`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pendingReviews")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={review.avatar || "/placeholder-user.jpg"} alt={review.submitter} />
                <AvatarFallback>{review.submitter.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-medium">{review.title}</p>
                <p className="text-sm text-muted-foreground">{review.description}</p>
                <p className="text-xs text-muted-foreground">
                  {t("submittedBy", { submitter: review.submitter, period: review.period })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleReview(review.id, "approve")}>
                  {t("approve")}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleReview(review.id, "reject")}>
                  {t("reject")}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">{t("noPendingReviews")}</p>
        )}
      </CardContent>
    </Card>
  )
}
