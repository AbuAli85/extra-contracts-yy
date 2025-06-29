"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Database, UserPlus, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { devLog } from "@/lib/dev-log"
import { useTranslations } from "next-intl"

export default function AdminTools() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const supabase = createClient()
  const t = useTranslations("DashboardAdminTools")

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
        <CardTitle>{t("adminToolsTitle")}</CardTitle>
        <CardDescription>{t("adminToolsDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {t("createUserButton")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Button onClick={handleSendWelcomeEmail} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          {t("sendWelcomeEmail")}
        </Button>
      </CardContent>
    </Card>
  )
}
