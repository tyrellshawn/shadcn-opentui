export type OpenTUIIrValue = string | number | boolean | OpenTUIIrNode[] | Record<string, unknown> | undefined

export type OpenTUIIrNodeKind = "box" | "text" | "scrollbox" | "fileNav" | "diffView" | "reviewStream" | "unknown"

export interface OpenTUIIrNode {
  kind: OpenTUIIrNodeKind
  name?: string
  props?: Record<string, OpenTUIIrValue>
  children?: OpenTUIIrNode[]
  value?: string
}

export interface OpenTUIIrProgram {
  name: string
  source: string
  nodes: OpenTUIIrNode[]
  notes: string[]
}

export const HUNK_VALIDATION_COMPONENTS = [
  "HunkDiffView",
  "HunkDiffBody",
  "HunkReviewStream",
  "HunkFileNav",
  "HunkDiffFileHeader",
] as const
