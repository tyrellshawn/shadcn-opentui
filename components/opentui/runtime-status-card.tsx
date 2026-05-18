import { FlaskConical, PackageCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getOpenTUIBrowserCapability, getOpenTUIInstallCommand } from "@/lib/opentui/browser-runtime"

export function OpenTUIRuntimeStatusCard() {
  const capability = getOpenTUIBrowserCapability()

  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FlaskConical className="h-5 w-5 text-emerald-400" />
          Shadcn OpenTUI Strategy
        </CardTitle>
        <CardDescription>Independent project positioning, current web path, and future runtime boundary.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-300">
            Current path: {capability.renderer}
          </Badge>
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-300">
            Not official OpenTUI
          </Badge>
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-300">
            Zig/WASM: {capability.browserRuntimeAvailable ? "ready" : "future research"}
          </Badge>
        </div>

        <p>{capability.reason}</p>
        <p>{capability.recommendation}</p>

        <div className="rounded-lg border border-emerald-500/20 bg-black/40 p-3 font-mono text-xs text-emerald-200">
          <div className="mb-2 flex items-center gap-2 font-sans text-sm font-medium text-emerald-300">
            <PackageCheck className="h-4 w-4" />
            Future runtime peer packages
          </div>
          <div>{capability.packages.join("\n")}</div>
          <div className="mt-3 text-emerald-300/80">Only for runtime research: {getOpenTUIInstallCommand()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
