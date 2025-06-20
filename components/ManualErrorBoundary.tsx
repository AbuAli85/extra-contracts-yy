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
    // For AbuAli85 - Applying manual boundary to the correct page.
    // Generated at: 2025-06-20 10:25:48 UTC
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
        <div className="p-4 border border-red-500">
            <h2 className="font-semibold text-red-700">Error Loading Editor</h2>
            <p>This component has crashed. Please try again.</p>
            <button
                onClick={() => this.setState({ hasError: false })}
                className="underline text-sm"
            >
                Try to reload this component
            </button>
        </div>
      )
    }

    return this.props.children
  }
}
