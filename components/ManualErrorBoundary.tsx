"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { FrownIcon } from "lucide-react"

interface ManualErrorBoundaryProps {
  children: React.ReactNode
}

interface ManualErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ManualErrorBoundary extends React.Component<ManualErrorBoundaryProps, ManualErrorBoundaryState> {
  constructor(props: ManualErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ManualErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-4 py-10">
          <FrownIcon className="h-16 w-16 text-destructive" />
          <h2 className="text-2xl font-bold text-destructive">Oops! Something went wrong.</h2>
          <p className="text-muted-foreground">We're sorry, but an unexpected error occurred.</p>
          {this.state.error && (
            <p className="text-sm text-muted-foreground">Error details: {this.state.error.message}</p>
          )}
          <Button onClick={() => this.setState({ hasError: false, error: null })}>Try again</Button>
        </div>
      )
    }

    return this.props.children
  }
}
