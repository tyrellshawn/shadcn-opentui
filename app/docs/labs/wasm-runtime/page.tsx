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
          <h1 className="text-4xl font-bold tracking-tight">Runtime Research</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl">
          The Zig/WASM code is kept in this repository for later browser-native rendering work. It is not the official
          OpenTUI project and it is not required for the current Shadcn OpenTUI component or codegen workflow.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Future research</Badge>
          <Badge variant="outline">Zig</Badge>
          <Badge variant="outline">WASM</Badge>
          <Badge variant="outline">Not main install path</Badge>
        </div>
      </div>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Research-only install
          </CardTitle>
          <CardDescription>Only needed when working directly on parked runtime packages</CardDescription>
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
            <p>Preserving the future option of browser-native rendering for OpenTUI apps.</p>
            <p>Keeping early runtime experiments available without making them the product promise.</p>
            <p>Separating long-term runtime research from the immediate OpenTUI-to-shadcn codegen path.</p>
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
            <p>Do not present this repository as the official OpenTUI web runtime.</p>
            <p>Do not require these packages for normal shadcn component installs.</p>
            <p>Do not import `packages/web-*` directly from registry components.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
