"use client"

import Link from "next/link"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, LogOutIcon } from "lucide-react"
import { useTranslations } from "next-intl"

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations("AuthStatus")

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    supabase.auth.getUser().then(({ data: { user: initialUser } }) => {
      setUser(initialUser)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: t("logoutError"),
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: t("logoutSuccess"),
        description: t("logoutSuccessMessage"),
      })
      router.push("/login")
    }
    setIsLoggingOut(false)
  }

  if (loading) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium hidden sm:inline">{user.email}</span>
        <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOutIcon className="h-4 w-4" />}
          <span className="sr-only sm:not-sr-only sm:ml-2">{t("logout")}</span>
        </Button>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/login">{t("login")}</Link>
    </Button>
  )
}
