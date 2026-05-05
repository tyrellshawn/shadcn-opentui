import { ArrowRight, FlaskConical, Terminal } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OpenTUIRuntimeStatusCard } from "@/components/opentui/runtime-status-card"

export default function LabsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-8 w-8 text-amber-500" />
          <h1 className="text-4xl font-bold tracking-tight">Experimental</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl">
          This section covers the Zig/WASM runtime lane. Use it to explore browser-native rendering, not as the default
          path for shadcn component installs.
        </p>
      </div>

      <OpenTUIRuntimeStatusCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              WASM Runtime
            </CardTitle>
            <CardDescription>Understand the Zig core, renderer, and React bridge</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/docs/labs/wasm-runtime" className="flex items-center gap-2">
                Open runtime notes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stable lane reminder</CardTitle>
            <CardDescription>Shadcn components remain the recommended default</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Install registry components when you want a production-ready browser terminal UI.</p>
            <p>Reach for the experimental runtime only when you need to validate the browser-native OpenTUI path.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
