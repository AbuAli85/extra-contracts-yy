export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === "string") {
    return error
  }
  
  return "An unexpected error occurred"
}

export function logError(error: unknown, context?: Record<string, any>) {
  console.error("Error:", {
    message: getErrorMessage(error),
    error,
    context,
    timestamp: new Date().toISOString(),
  })
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const message = errorMessage || getErrorMessage(error)
    logError(error, { errorMessage })
    throw new AppError(message, undefined, undefined, { originalError: error })
  }
}

export function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    let attempt = 0
    
    while (attempt < maxRetries) {
      try {
        const result = await fn()
        resolve(result)
        return
      } catch (error) {
        attempt++
        
        if (attempt >= maxRetries) {
          logError(error, { attempt, maxRetries })
          reject(error)
          return
        }
        
        const waitTime = delay * Math.pow(backoffMultiplier, attempt - 1)
        logError(error, { attempt, maxRetries, retryingInMs: waitTime })
        
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  })
}

export function handleAsyncError(error: unknown, fallbackMessage?: string) {
  const message = getErrorMessage(error) || fallbackMessage || "Operation failed"
  logError(error)
  
  // Here you could add integration with error reporting services
  // like Sentry, LogRocket, etc.
  
  return message
}

export interface ErrorBoundaryFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function createErrorBoundaryFallback(
  customMessage?: string
): React.ComponentType<ErrorBoundaryFallbackProps> {
  return function ErrorFallback({ error, resetErrorBoundary }: ErrorBoundaryFallbackProps) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            {customMessage || "Something went wrong"}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }
}