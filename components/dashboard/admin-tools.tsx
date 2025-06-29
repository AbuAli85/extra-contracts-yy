"use client"
import { useState } from "react"
import type React from "react"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { devLog } from "@/lib/dev-log"
import { Loader2, Database, UserPlus, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "@/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { AdminAction } from "@/lib/dashboard-types"

interface AdminToolsProps {
  actions: AdminAction[]
}

export function AdminTools({ actions }: AdminToolsProps) {
  const { toast } = useToast()
  const t = useTranslations("DashboardAdminTools")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const supabase = createClient()

  const handleAction = (actionName: string) => {
    toast({
      title: t("actionTriggered"),
      description: t("actionTriggeredDescription", { actionName }),
    })
    // In a real application, you would call a server action or API route here
    console.log(`Admin action triggered: ${actionName}`)
  }

  const handleRunMigration = async () => {
    setLoading(true)
    try {
      // This is a placeholder. In a real app, you'd trigger a server-side migration script.
      // For now, we'll simulate success/failure.
      devLog("Simulating database migration...")
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      toast({ title: t("migrationSuccessTitle"), description: t("migrationSuccessDescription") })
    } catch (error: any) {
      console.error("Migration error:", error)
      toast({
        title: t("migrationErrorTitle"),
        description: error.message || t("migrationErrorDescription"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data.user) {
        toast({ title: t("userCreateSuccessTitle"), description: t("userCreateSuccessDescription") })
        setEmail("")
        setPassword("")
      } else {
        toast({ title: t("userCreatePendingTitle"), description: t("userCreatePendingDescription") })
      }
    } catch (error: any) {
      console.error("User creation error:", error)
      toast({
        title: t("userCreateErrorTitle"),
        description: error.message || t("userCreateErrorDescription"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendWelcomeEmail = async () => {
    setLoading(true)
    try {
      // This is a placeholder. In a real app, you'd trigger a server-side function
      // to send a welcome email, possibly using a service like Resend or SendGrid.
      devLog("Simulating sending welcome email...")
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      toast({ title: t("welcomeEmailSuccessTitle"), description: t("welcomeEmailSuccessDescription") })
    } catch (error: any) {
      console.error("Welcome email error:", error)
      toast({
        title: t("welcomeEmailErrorTitle"),
        description: error.message || t("welcomeEmailErrorDescription"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("adminTools")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {actions.length > 0 ? (
          actions.map((action) => (
            <div key={action.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{action.name}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <Button onClick={() => handleAction(action.name)} size="sm">
                {t("run")}
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">{t("noActionsAvailable")}</p>
        )}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="announcement-title">{t("sendAnnouncement")}</Label>
            <Input id="announcement-title" placeholder={t("announcementTitle")} />
            <Textarea id="announcement-content" placeholder={t("announcementContent")} rows={3} />
            <Button className="w-full">{t("sendAnnouncementButton")}</Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-management">{t("userManagement")}</Label>
            <Link href="/dashboard/users">
              <Button variant="outline" className="w-full bg-transparent">
                {t("manageUsers")}
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audit-logs">{t("auditLogs")}</Label>
            <Link href="/dashboard/audit">
              <Button variant="outline" className="w-full bg-transparent">
                {t("viewAuditLogs")}
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button onClick={handleRunMigration} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
              {t("runMigrations")}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={loading}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("createNewUser")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("createNewUserTitle")}</DialogTitle>
                  <DialogDescription>{t("createNewUserDescription")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t("emailLabel")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t("passwordLabel")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    {t("createUserButton")}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button onClick={handleSendWelcomeEmail} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              {t("sendWelcomeEmail")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
