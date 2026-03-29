import { Cpu, PackageCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getOpenTUIBrowserCapability, getOpenTUIInstallCommand } from "@/lib/opentui/browser-runtime"

export function OpenTUIRuntimeStatusCard() {
  const capability = getOpenTUIBrowserCapability()

  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cpu className="h-5 w-5 text-emerald-400" />
          OpenTUI Runtime Strategy
        </CardTitle>
        <CardDescription>Installed packages, browser strategy, and the boundary for future Zig/WASM adoption.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-300">
            Browser renderer: {capability.renderer}
          </Badge>
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-300">
            Shadcn compatible
          </Badge>
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-300">
            WASM runtime: {capability.browserRuntimeAvailable ? "ready" : "not public yet"}
          </Badge>
        </div>

        <p>{capability.reason}</p>
        <p>{capability.recommendation}</p>

        <div className="rounded-lg border border-emerald-500/20 bg-black/40 p-3 font-mono text-xs text-emerald-200">
          <div className="mb-2 flex items-center gap-2 font-sans text-sm font-medium text-emerald-300">
            <PackageCheck className="h-4 w-4" />
            Required packages
          </div>
          <div>{capability.packages.join("\n")}</div>
          <div className="mt-3 text-emerald-300/80">Install: {getOpenTUIInstallCommand()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
