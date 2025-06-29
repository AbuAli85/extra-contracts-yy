import { redirect } from "next/navigation"

export default function LoginLoading() {
  // Redirect to the default locale version if accessed directly without locale
  redirect("/en/login")
  return null
}

// This page is intentionally left blank or can be used for non-i18n specific logic
// The actual content is in app/[locale]/login/loading.tsx
