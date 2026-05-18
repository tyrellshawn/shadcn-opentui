import type { OpenTUIIrProgram } from "./ir"

export const hunkFixtureProgram: OpenTUIIrProgram = {
  name: "GeneratedHunkReview",
  source: "hunkdiff/opentui",
  notes: [
    "Models HunkReviewStream, HunkFileNav, and HunkDiffView as a browser-viewable shadcn layout.",
    "This fixture is intentionally static until the ANTLR visitor can translate selected Hunk source files.",
  ],
  nodes: [
    {
      kind: "fileNav",
      name: "HunkFileNav",
    },
    {
      kind: "reviewStream",
      name: "HunkReviewStream",
    },
  ],
}
