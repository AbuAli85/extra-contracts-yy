'use client'

import React from 'react'

interface State {
  hasError: boolean;
}

export class ManualErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    // For AbuAli85 - This is a manual error boundary to work around the broken environment.
    // Generated at: 2025-06-20 10:19:31 UTC
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ManualErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4">
            <h2 className="font-semibold">An Error Occurred</h2>
            <p>We ran into a problem loading this component.</p>
            <button
                onClick={() => this.setState({ hasError: false })}
                className="underline text-sm"
            >
                Try again
            </button>
        </div>
      )
    }

    return this.props.children
  }
}
