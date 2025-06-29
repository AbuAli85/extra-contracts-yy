"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations("AuthForm")

  const supabase = createClient()

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast({
        title: t("authError"),
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: t("authSuccess"),
        description: isSignUp ? t("signUpSuccess") : t("signInSuccess"),
      })
      router.push("/dashboard")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{t("passwordLabel")}</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isSignUp ? t("signingUp") : t("signingIn")}
          </>
        ) : isSignUp ? (
          t("signUp")
        ) : (
          t("signIn")
        )}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        {isSignUp ? t("alreadyHaveAccount") : t("dontHaveAccount")}{" "}
        <Button variant="link" type="button" onClick={() => setIsSignUp(!isSignUp)} disabled={loading} className="px-0">
          {isSignUp ? t("signInLink") : t("signUpLink")}
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="text-primary hover:underline">
          {t("continueAsGuest")}
        </Link>
      </div>
    </form>
  )
}
