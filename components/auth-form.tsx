"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AuthForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast({ title: "Sign In Error", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Success!", description: "You are now signed in." })
      router.push("/generate-contract") // Redirect to contract generation form
      router.refresh() // Refresh server components
    }
    setIsSubmitting(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({ email, password })

    if (error) {
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive" })
    } else if (user) {
      toast({
        title: "Success!",
        description: "Signed up successfully. Please check your email to confirm your account.",
      })
      // Optional: You might want to sign them in automatically or redirect
      router.push("/generate-contract") // Redirect to contract generation form after sign up
      router.refresh()
    }
    setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Sign in or create an account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleSignIn} className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <Button onClick={handleSignUp} variant="outline" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
