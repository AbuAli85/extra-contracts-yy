<<<<<<< HEAD
import { HomePageContent } from "@/components/home-page-content"
=======
>>>>>>> 9a85d41a537ac4cef2e93e000150b7413e1a66a6

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  return <HomePageContent locale={locale} />
}
