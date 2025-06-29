"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ManualErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle className="text-destructive">Something went wrong.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">We're sorry, but an unexpected error occurred.</p>
                {this.state.error && <p className="text-sm text-muted-foreground">Error: {this.state.error.message}</p>}
                {this.state.errorInfo && (
                  <details className="mt-4 whitespace-pre-wrap text-left text-xs text-muted-foreground">
                    <summary>Error Details</summary>
                    {this.state.errorInfo.componentStack}
                  </details>
                )}
                <Button onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}>
                  Try again
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      )
    }

    return this.props.children
  }
}
