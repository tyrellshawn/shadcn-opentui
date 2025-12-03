"use client"

import { Button } from "@/components/ui/button"
import { Home, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="space-y-2">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-semibold text-foreground">Something went wrong!</h1>
          <p className="text-muted-foreground">An unexpected error occurred. This might be a temporary issue.</p>
          {error.digest && <p className="text-xs text-muted-foreground font-mono">Error ID: {error.digest}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Return to the terminal component showcase</p>
        </div>
      </div>
    </div>
  )
}
