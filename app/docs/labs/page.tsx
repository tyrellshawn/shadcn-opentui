import { ArrowRight, Code2, FlaskConical, Terminal } from "lucide-react"
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
          <h1 className="text-4xl font-bold tracking-tight">Codegen Lab</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Shadcn OpenTUI is currently focused on translating OpenTUI-style TypeScript applications into shadcn web code.
          The Zig/WASM runtime remains in-tree as future research, not the default developer path.
        </p>
      </div>

      <OpenTUIRuntimeStatusCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              OpenTUI-to-shadcn generator
            </CardTitle>
            <CardDescription>Custom grammar, intermediate representation, and TSX output</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              The generator starts with a practical OpenTUI TSX subset and produces readable React/shadcn components
              instead of hiding behavior behind a runtime.
            </p>
            <Button asChild variant="outline">
              <Link href="/docs/examples/hunk" className="flex items-center gap-2">
                View Hunk example
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Future runtime research
            </CardTitle>
            <CardDescription>Zig/WASM code is kept, but parked behind the codegen story</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              The browser-native runtime work is useful long-term, but the current traction path is helping developers
              view and adapt OpenTUI-style apps on the web through shadcn components.
            </p>
            <Button asChild variant="outline">
              <Link href="/docs/labs/wasm-runtime" className="flex items-center gap-2">
                Read runtime notes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
