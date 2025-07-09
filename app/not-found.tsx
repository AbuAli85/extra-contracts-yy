export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <h2 className="mb-4 text-3xl font-semibold">Page Not Found</h2>
      <p className="mb-8 text-lg text-muted-foreground">The page you are looking for does not exist.</p>
      <a href="/" className="inline-block rounded bg-primary px-4 py-2 text-white">Go Home</a>
    </div>
  )
}
