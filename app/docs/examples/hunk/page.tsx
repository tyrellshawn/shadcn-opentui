import { Code2, ExternalLink, GitPullRequestArrow } from "lucide-react"
import Link from "next/link"
import { readFileSync } from "fs"
import { join } from "path"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "@/components/docs/code-block"
import { HunkReviewView } from "@/generated/hunk/HunkReviewView.generated"

const generatedComponentSource = readFileSync(
  join(process.cwd(), "generated/hunk/HunkReviewView.generated.tsx"),
  "utf-8",
)

const irSnapshot = readFileSync(
  join(process.cwd(), "generated/hunk/ir.json"),
  "utf-8",
)

export default function HunkExamplePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GitPullRequestArrow className="h-8 w-8 text-emerald-500" />
          <h1 className="text-4xl font-bold tracking-tight">Hunk Web Example</h1>
        </div>
        <p className="max-w-3xl text-xl text-muted-foreground">
          Hunk is the project-level validation target for Shadcn OpenTUI: a real OpenTUI diff review application that
          is now viewable as generated shadcn web code via <code>HunkReviewView</code>.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Hunk-inspired</Badge>
          <Badge variant="default" className="bg-emerald-600 text-white">Generated</Badge>
          <Badge variant="outline">Codegen output</Badge>
          <Badge variant="outline">Not official OpenTUI</Badge>
        </div>
      </div>

      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Source inspiration
          </CardTitle>
          <CardDescription>
            Hunk publishes reusable OpenTUI primitives such as `HunkDiffView`, `HunkReviewStream`, and `HunkFileNav`.
            Generated from local external fixture at <code className="text-emerald-300">Github/vendor/hunk</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="https://github.com/modem-dev/hunk" target="_blank" className="flex items-center gap-2">
              Open modem-dev/hunk
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Live generated component</h2>
        <div className="min-h-[400px] rounded-lg border bg-black/60">
          <HunkReviewView />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Parser IR snapshot</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Intermediate representation extracted from the OpenTUI source via <code>hunk:generate</code>.
        </p>
        <CodeBlock code={irSnapshot} language="json" title="generated/hunk/ir.json" />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Generated component source</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          The <code>HunkReviewView</code> component rendered above, produced by the shadcn codegen from the Hunk fixture.
        </p>
        <CodeBlock code={generatedComponentSource} language="tsx" title="generated/hunk/HunkReviewView.generated.tsx" />
      </section>
    </div>
  )
}
