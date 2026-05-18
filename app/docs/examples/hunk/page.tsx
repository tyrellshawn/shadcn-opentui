import { Code2, ExternalLink, FileText, GitPullRequestArrow, PanelLeft } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "@/components/docs/code-block"

const files = [
  { path: "src/opentui/HunkReviewStream.tsx", additions: 24, deletions: 5, active: true },
  { path: "src/opentui/HunkFileNav.tsx", additions: 12, deletions: 2, active: false },
  { path: "src/opentui/HunkDiffView.tsx", additions: 8, deletions: 1, active: false },
]

const samplePatch = `diff --git a/src/opentui/HunkReviewStream.tsx b/src/opentui/HunkReviewStream.tsx
index 2d0b4f7..7ca51bd 100644
--- a/src/opentui/HunkReviewStream.tsx
+++ b/src/opentui/HunkReviewStream.tsx
@@ -12,8 +12,12 @@ export function HunkReviewStream({ files, width, layout }) {
-  return files.map((file) => (
-    <HunkDiffBody key={file.id} file={file} width={width} layout={layout} />
-  ))
+  return (
+    <scrollbox width="100%" height="100%" scrollY>
+      {files.map((file) => (
+        <HunkDiffBody key={file.id} file={file} width={width} layout={layout} />
+      ))}
+    </scrollbox>
+  )
 }
`

const generatedCode = `export function GeneratedHunkReview() {
  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-lg border bg-black/50 p-3 font-mono text-xs">
        <div className="mb-2 text-emerald-300">Files</div>
        <button>src/opentui/HunkReviewStream.tsx</button>
      </aside>
      <section className="rounded-lg border bg-black/60 p-4 font-mono text-xs">
        <pre><code>{samplePatch}</code></pre>
      </section>
    </div>
  )
}`

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
          should eventually be viewable as generated shadcn web code.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Hunk-inspired</Badge>
          <Badge variant="outline">Static fixture</Badge>
          <Badge variant="outline">Generated-code target</Badge>
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

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="bg-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PanelLeft className="h-4 w-4" />
              Files
            </CardTitle>
            <CardDescription>Hunk-style review navigation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {files.map((file) => (
              <div
                key={file.path}
                className={`rounded-md border px-3 py-2 font-mono text-xs ${
                  file.active
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                    : "border-border/60 bg-background/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="break-all">{file.path}</span>
                </div>
                <div className="mt-1 text-[11px]">
                  <span className="text-emerald-400">+{file.additions}</span>{" "}
                  <span className="text-red-400">-{file.deletions}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-black/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Code2 className="h-4 w-4" />
              Generated review stream target
            </CardTitle>
            <CardDescription>A static shadcn rendering of the kind of Hunk view the generator should emit.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[480px] overflow-auto rounded-lg border border-emerald-500/20 bg-black p-4 text-xs leading-relaxed text-emerald-100">
              <code>{samplePatch}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      <CodeBlock code={generatedCode} language="tsx" title="Generated shadcn target" />
    </div>
  )
}
