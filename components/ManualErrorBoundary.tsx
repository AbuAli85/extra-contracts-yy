"use client"

import React from "react"

interface ManualErrorBoundaryProps {
  children: React.ReactNode
}

interface ManualErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ManualErrorBoundary extends React.Component<ManualErrorBoundaryProps, ManualErrorBoundaryState> {
  constructor(props: ManualErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ManualErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-8 text-center shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-destructive">Something went wrong!</h2>
            <p className="text-muted-foreground">We apologize for the inconvenience. Please try again later.</p>
            {this.state.error && (
              <details className="mt-4 text-sm text-left text-muted-foreground">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap break-all rounded-md bg-muted p-4 text-xs">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
