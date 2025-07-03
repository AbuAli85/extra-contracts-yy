"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, MessageSquare, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
// Use a static path rather than importing the file. Importing triggered
// filesystem lookups on `/public/placeholder.svg` which fail in some
// environments.
const placeholderAvatar = "/placeholder.svg"
import { devLog } from "@/lib/dev-log"
import type { ReviewItem } from "@/lib/dashboard-types" // Ensure this type is defined
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

export default function ReviewPanel() {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchReviewItems = async () => {
    setLoading(true)
    try {
      // Fetch recent contracts for review (without status filter since status column doesn't exist)
      const { data, error } = await supabase
        .from("contracts")
        .select(
          `
          id, created_at,
          employer:parties!contracts_employer_id_fkey(id,name_en,name_ar),
          client:parties!contracts_client_id_fkey(id,name_en,name_ar),
          promoters(id,name_en,name_ar)
          `,
        )
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error

      const formattedItems: ReviewItem[] = data.map((item: any) => ({
        id: item.id,
        title: `Contract: ${item.id}`,
        promoter: item.promoters && item.promoters.length > 0 ? item.promoters[0].name_en || "N/A" : "N/A",
        parties: `${item.client?.name_en || "Client"} / ${item.employer?.name_en || "Employer"}`,
        period: `Submitted ${formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}`, // Example period
        contractLink: `/contracts/${item.id}`, // Link to view the contract details
        // You might need to fetch submitter details (user_id) separately if not directly available
        submitter: "System",
        // Use a static placeholder path without query params to avoid file system errors
        avatar: placeholderAvatar,
      }))
      setReviewItems(formattedItems)
    } catch (error: any) {
      console.error("Error fetching review items:", error)
      toast({
        title: "Error Fetching Review Items",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviewItems()
    const channel = supabase
      .channel("public:contracts:review")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contracts" },
        (payload) => {
          devLog("Review items change:", payload)
          toast({
            title: "New Item for Review",
            description: "An item has been submitted for review.",
          })
          fetchReviewItems()
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleAction = async (itemId: string, action: "approve" | "reject" | "comment") => {
    toast({ title: `Action: ${action}`, description: `Processing item ${itemId}...` })
    // Placeholder for actual Supabase update logic
    // Example: await supabase.from('contracts').update({ status: 'Approved' }).eq('id', itemId)
    // After action, refetch or update local state
    fetchReviewItems()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items for Review / عناصر للمراجعة</CardTitle>
        <CardDescription>
          Contracts and documents awaiting your approval or feedback. / العقود والمستندات التي تنتظر
          موافقتك أو ملاحظاتك.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          {loading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {!loading && reviewItems.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              No items currently need review. / لا توجد عناصر تحتاج إلى مراجعة حاليًا.
            </p>
          )}
          {!loading && reviewItems.length > 0 && (
            <div className="space-y-4">
              {reviewItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="secondary">For Review</Badge>
                        <h4 className="font-semibold">{item.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Parties: {item.parties}</p>
                      <p className="text-sm text-muted-foreground">Promoter: {item.promoter}</p>
                      <p className="text-xs text-muted-foreground">{item.period}</p>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.avatar || placeholderAvatar} alt={item.submitter} />
                      <AvatarFallback>
                        {item.submitter?.substring(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(item.id, "approve")}
                    >
                      <ThumbsUp className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(item.id, "reject")}
                    >
                      <ThumbsDown className="mr-1 h-4 w-4" /> Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction(item.id, "comment")}
                    >
                      <MessageSquare className="mr-1 h-4 w-4" /> Comment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
