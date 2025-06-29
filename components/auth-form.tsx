"use client"

import { useState } from "react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

export function AuthForm() {
  const supabase = createClient()
  const { theme } = useTheme()
  const t = useTranslations("AuthForm")

  const [view, setView] = useState<"sign_in" | "sign_up" | "forgot_password" | "update_password">("sign_in")

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google", "github"]}
      redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`}
      localization={{
        variables: {
          sign_in: {
            email_label: t("emailLabel"),
            password_label: t("passwordLabel"),
            email_input_placeholder: t("emailPlaceholder"),
            password_input_placeholder: t("passwordPlaceholder"),
            button_label: t("signInButton"),
            social_auth_button_text: t("signInWithSocial"),
            link_text: t("alreadyHaveAccount"),
            forgotten_password: t("forgotPassword"),
            no_account: t("noAccount"),
          },
          sign_up: {
            email_label: t("emailLabel"),
            password_label: t("passwordLabel"),
            email_input_placeholder: t("emailPlaceholder"),
            password_input_placeholder: t("passwordPlaceholder"),
            button_label: t("signUpButton"),
            social_auth_button_text: t("signUpWithSocial"),
            link_text: t("alreadyHaveAccount"),
          },
          forgotten_password: {
            email_label: t("emailLabel"),
            email_input_placeholder: t("emailPlaceholder"),
            button_label: t("sendResetInstructions"),
            link_text: t("rememberPassword"),
          },
          update_password: {
            password_label: t("newPasswordLabel"),
            password_input_placeholder: t("newPasswordPlaceholder"),
            button_label: t("updatePassword"),
          },
        },
      }}
      theme={theme === "dark" ? "dark" : "default"}
      view={view}
      onViewChange={setView}
    />
  )
}
