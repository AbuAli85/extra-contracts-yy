import { redirect } from "next/navigation"

// This page is intentionally left blank or can be used for non-i18n specific logic
// The actual content is in app/[locale]/page.tsx
export default function HomePage() {
  // Redirect to the default locale version if accessed directly without locale
  redirect("/en")
  return null
}
