import { redirect } from "next/navigation"

export default function Loading() {
  // Redirect to the default locale version if accessed directly without locale
  redirect("/en")
  return null

  // Uncomment the following code to use it for non-i18n specific logic
  // The actual content is in app/[locale]/loading.tsx
  // return (
  //   <div className="flex flex-col min-h-screen">
  //     {/* Header Skeleton */}
  //     <header className="sticky top-0 z-40 w-full border-b bg-background">
  //       <div className="container flex h-16 items-center justify-between py-4">
  //         <div className="flex items-center space-x-4">
  //           <Skeleton className="h-8 w-32" /> {/* Logo/Brand */}
  //           <div className="hidden md:flex space-x-4">
  //             <Skeleton className="h-6 w-20" />
  //             <Skeleton className="h-6 w-24" />
  //             <Skeleton className="h-6 w-20" />
  //           </div>
  //         </div>
  //         <div className="flex items-center space-x-4">
  //           <Skeleton className="h-8 w-8 rounded-full" /> {/* User Avatar */}
  //           <Skeleton className="h-8 w-24" /> {/* Language Switcher */}
  //         </div>
  //       </div>
  //     </header>

  //     {/* Main Content Skeleton */}
  //     <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
  //       <div className="flex items-center justify-between mb-6">
  //         <Skeleton className="h-10 w-64" /> {/* Page Title */}
  //         <Skeleton className="h-10 w-32" /> {/* Action Button */}
  //       </div>
  //       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  //         {Array.from({ length: 6 }).map((_, i) => (
  //           <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
  //         ))}
  //       </div>
  //     </main>

  //     {/* Footer Skeleton */}
  //     <footer className="border-t bg-background py-6 text-center text-sm text-muted-foreground">
  //       <Skeleton className="h-4 w-48 mx-auto" />
  //     </footer>
  //   </div>
  // )
}
