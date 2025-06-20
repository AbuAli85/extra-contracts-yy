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
    // For AbuAli85 - Final Strategy: Manual Error Boundary
    // This avoids the broken file system detection in your environment.
    // Generated at: 2025-06-20 10:23:48 UTC
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ManualErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500">
            <h2 className="font-semibold text-red-700">An Error Occurred</h2>
            <p>This part of the application has crashed.</p>
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
