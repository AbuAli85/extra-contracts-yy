"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const { toast } = useToast()
  const t = useTranslations("AuthForm")

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast({
        title: t("loginError"),
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: t("loginSuccess"),
        description: t("loggedInMessage"),
      })
    }
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      toast({
        title: t("signUpError"),
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: t("signUpSuccess"),
        description: t("checkEmailMessage"),
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
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
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSignUp ? t("signUpButton") : t("signInButton")}
      </Button>
      <Button type="button" variant="link" className="w-full" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? t("alreadyHaveAccount") : t("dontHaveAccount")}
      </Button>
    </form>
  )
}
