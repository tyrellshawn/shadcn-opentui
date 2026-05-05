import { Code2, Download, FlaskConical, Terminal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/docs/code-block"

export default function WasmRuntimePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-8 w-8 text-amber-500" />
          <h1 className="text-4xl font-bold tracking-tight">WASM Runtime</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl">
          The experimental Zig/WASM lane powers the browser runtime. It is separate from the shadcn component surface and may
          change as the rendering APIs evolve.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Experimental</Badge>
          <Badge variant="outline">Zig</Badge>
          <Badge variant="outline">WASM</Badge>
          <Badge variant="outline">Browser runtime</Badge>
        </div>
      </div>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Optional install
          </CardTitle>
          <CardDescription>Only needed if you are testing the runtime packages directly</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={`bun add @opentui/core @opentui/react`} language="bash" showLineNumbers={false} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              What it is for
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Validating browser-native rendering for OpenTUI apps.</p>
            <p>Testing the Zig buffer, Canvas renderer, and React reconciler split.</p>
            <p>Exploring a path beyond the shadcn component wrapper.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              What to avoid
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Do not depend on these packages for the normal shadcn install path.</p>
            <p>Do not import `packages/web-*` directly from registry components.</p>
            <p>Expect APIs to change while the runtime is still being validated.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
